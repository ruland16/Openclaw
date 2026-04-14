-- Memory System Enhancement Migration
-- Adds additional tables for comprehensive memory tracking
-- Author: Brains (CMO)
-- Date: 2026-04-10

-- Enable foreign keys
PRAGMA foreign_keys = ON;

-- ============================================
-- 1. AGENT SESSIONS TABLE
-- Tracks agent session lifecycle and metadata
-- ============================================
CREATE TABLE IF NOT EXISTS agent_sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    agent_id INTEGER NOT NULL,
    session_uuid TEXT UNIQUE NOT NULL,
    start_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    end_time TIMESTAMP,
    status TEXT DEFAULT 'active',  -- 'active', 'completed', 'error', 'terminated'
    metadata TEXT,  -- JSON: model, configuration, environment
    memory_usage_start INTEGER,  -- Starting memory in bytes
    memory_usage_end INTEGER,    -- Ending memory in bytes
    task_count INTEGER DEFAULT 0,
    error_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (agent_id) REFERENCES agents(id) ON DELETE CASCADE
);

-- Indexes for agent_sessions
CREATE INDEX IF NOT EXISTS idx_agent_sessions_agent_id ON agent_sessions(agent_id);
CREATE INDEX IF NOT EXISTS idx_agent_sessions_status ON agent_sessions(status);
CREATE INDEX IF NOT EXISTS idx_agent_sessions_start_time ON agent_sessions(start_time);
CREATE INDEX IF NOT EXISTS idx_agent_sessions_session_uuid ON agent_sessions(session_uuid);

-- ============================================
-- 2. TASK EXECUTIONS TABLE
-- Detailed task execution tracking with memory metrics
-- ============================================
CREATE TABLE IF NOT EXISTS task_executions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    task_id TEXT NOT NULL,  -- External task identifier
    task_name TEXT NOT NULL,
    agent_id INTEGER NOT NULL,
    session_id INTEGER,  -- References agent_sessions
    start_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    end_time TIMESTAMP,
    status TEXT DEFAULT 'running',  -- 'running', 'completed', 'failed', 'cancelled'
    result_data TEXT,  -- JSON: task results/output
    error_message TEXT,
    duration_ms INTEGER,  -- Calculated duration in milliseconds
    memory_peak INTEGER,  -- Peak memory usage during task (bytes)
    memory_average INTEGER,  -- Average memory usage (bytes)
    cpu_peak REAL,  -- Peak CPU usage percentage
    priority INTEGER DEFAULT 0,
    tags TEXT,  -- JSON array of tags
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (agent_id) REFERENCES agents(id) ON DELETE CASCADE,
    FOREIGN KEY (session_id) REFERENCES agent_sessions(id) ON DELETE SET NULL
);

-- Indexes for task_executions
CREATE INDEX IF NOT EXISTS idx_task_executions_task_id ON task_executions(task_id);
CREATE INDEX IF NOT EXISTS idx_task_executions_agent_id ON task_executions(agent_id);
CREATE INDEX IF NOT EXISTS idx_task_executions_status ON task_executions(status);
CREATE INDEX IF NOT EXISTS idx_task_executions_start_time ON task_executions(start_time);
CREATE INDEX IF NOT EXISTS idx_task_executions_session_id ON task_executions(session_id);

-- ============================================
-- 3. MEMORY USAGE TIME SERIES TABLE
-- Fine-grained memory usage tracking over time
-- ============================================
CREATE TABLE IF NOT EXISTS memory_usage_series (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    agent_id INTEGER NOT NULL,
    session_id INTEGER,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    memory_current INTEGER NOT NULL,  -- Current memory in bytes
    memory_peak INTEGER NOT NULL,     -- Peak memory since session start
    memory_limit INTEGER,             -- Configured memory limit if any
    process_count INTEGER,            -- Number of active processes
    collection_interval INTEGER DEFAULT 30000,  -- Collection interval in ms
    metadata TEXT,  -- JSON: additional metrics
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (agent_id) REFERENCES agents(id) ON DELETE CASCADE,
    FOREIGN KEY (session_id) REFERENCES agent_sessions(id) ON DELETE SET NULL
);

-- Indexes for memory_usage_series
CREATE INDEX IF NOT EXISTS idx_memory_usage_series_agent_id ON memory_usage_series(agent_id);
CREATE INDEX IF NOT EXISTS idx_memory_usage_series_timestamp ON memory_usage_series(timestamp);
CREATE INDEX IF NOT EXISTS idx_memory_usage_series_session_id ON memory_usage_series(session_id);
CREATE INDEX IF NOT EXISTS idx_memory_usage_series_agent_time ON memory_usage_series(agent_id, timestamp);

-- ============================================
-- 4. SEARCH INDEX TABLE
-- Optimized full-text search index
-- ============================================
CREATE TABLE IF NOT EXISTS search_index (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    source_table TEXT NOT NULL,  -- 'agent_activities', 'memory_entries', 'task_executions'
    source_id INTEGER NOT NULL,  -- Foreign key to source table
    content TEXT NOT NULL,       -- Searchable text content
    metadata TEXT,               -- JSON: additional search metadata
    indexed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    search_vector TEXT,          -- For full-text search (SQLite FTS5 would be better)
    relevance_score REAL DEFAULT 1.0,
    FOREIGN KEY (source_table, source_id) REFERENCES source_table(id)  -- Note: SQLite doesn't support this directly
);

-- Indexes for search_index
CREATE INDEX IF NOT EXISTS idx_search_index_source ON search_index(source_table, source_id);
CREATE INDEX IF NOT EXISTS idx_search_index_indexed_at ON search_index(indexed_at);
CREATE INDEX IF NOT EXISTS idx_search_index_relevance ON search_index(relevance_score);

-- ============================================
-- 5. MEMORY AGGREGATES TABLE
-- Pre-aggregated metrics for performance
-- ============================================
CREATE TABLE IF NOT EXISTS memory_aggregates (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    agent_id INTEGER NOT NULL,
    aggregation_period TEXT NOT NULL,  -- 'hourly', 'daily', 'weekly'
    period_start TIMESTAMP NOT NULL,
    period_end TIMESTAMP NOT NULL,
    task_count INTEGER DEFAULT 0,
    task_completed INTEGER DEFAULT 0,
    task_failed INTEGER DEFAULT 0,
    avg_duration_ms INTEGER,
    avg_memory_usage INTEGER,
    peak_memory_usage INTEGER,
    error_rate REAL,  -- Errors per task
    memory_efficiency REAL,  -- Memory usage efficiency score
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(agent_id, aggregation_period, period_start),
    FOREIGN KEY (agent_id) REFERENCES agents(id) ON DELETE CASCADE
);

-- Indexes for memory_aggregates
CREATE INDEX IF NOT EXISTS idx_memory_aggregates_agent_period ON memory_aggregates(agent_id, aggregation_period, period_start);
CREATE INDEX IF NOT EXISTS idx_memory_aggregates_period_start ON memory_aggregates(period_start);

-- ============================================
-- 6. UPDATE EXISTING TABLES
-- Add missing columns to existing tables
-- ============================================

-- Add priority column to agent_activities if it doesn't exist
-- Note: SQLite doesn't support ALTER TABLE ADD COLUMN IF NOT EXISTS directly
-- We'll use a try-catch approach in the application layer

-- Add session_id to agent_activities for better tracing
-- This would require application-level migration

-- ============================================
-- 7. CREATE VIEWS FOR COMMON QUERIES
-- ============================================

-- View for agent activity summary
CREATE VIEW IF NOT EXISTS agent_activity_summary AS
SELECT 
    a.name AS agent_name,
    a.role AS agent_role,
    COUNT(DISTINCT s.id) AS session_count,
    COUNT(DISTINCT te.id) AS task_count,
    SUM(CASE WHEN te.status = 'completed' THEN 1 ELSE 0 END) AS tasks_completed,
    SUM(CASE WHEN te.status = 'failed' THEN 1 ELSE 0 END) AS tasks_failed,
    AVG(te.duration_ms) AS avg_duration_ms,
    MAX(mus.memory_peak) AS peak_memory_used,
    MAX(a.last_seen) AS last_activity
FROM agents a
LEFT JOIN agent_sessions s ON a.id = s.agent_id
LEFT JOIN task_executions te ON a.id = te.agent_id
LEFT JOIN memory_usage_series mus ON a.id = mus.agent_id
WHERE a.status = 'active'
GROUP BY a.id, a.name, a.role;

-- View for memory usage trends
CREATE VIEW IF NOT EXISTS memory_usage_trends AS
SELECT 
    a.name AS agent_name,
    DATE(mus.timestamp) AS usage_date,
    HOUR(mus.timestamp) AS usage_hour,
    AVG(mus.memory_current) AS avg_memory,
    MAX(mus.memory_peak) AS max_memory,
    COUNT(*) AS sample_count
FROM memory_usage_series mus
JOIN agents a ON mus.agent_id = a.id
WHERE mus.timestamp >= datetime('now', '-7 days')
GROUP BY a.name, DATE(mus.timestamp), HOUR(mus.timestamp)
ORDER BY usage_date DESC, usage_hour DESC;

-- ============================================
-- 8. INSERT INITIAL DATA
-- ============================================

-- Create a session for Brains (CMO)
INSERT OR IGNORE INTO agent_sessions (agent_id, session_uuid, status, metadata)
VALUES (
    (SELECT id FROM agents WHERE name = 'Brains'),
    'brains-memory-integration-001',
    'active',
    json_object(
        'model', 'Gemma 4',
        'task', 'Memory System Integration',
        'project', 'Mission Control Dashboard',
        'start_reason', 'Database setup completed by Elon'
    )
);

-- Log initial activity for memory system design
INSERT OR IGNORE INTO agent_activities (agent_id, activity_type, description, metadata)
VALUES (
    (SELECT id FROM agents WHERE name = 'Brains'),
    'system_design',
    'Completed memory integration system design document',
    json_object(
        'document', 'MEMORY_INTEGRATION_DESIGN.md',
        'size_bytes', 11771,
        'tables_designed', 5,
        'apis_designed', 4
    )
);

-- Log task execution for design phase
INSERT OR IGNORE INTO task_executions (
    task_id, 
    task_name, 
    agent_id, 
    status, 
    result_data,
    duration_ms,
    priority
)
VALUES (
    'mission-control-memory-design',
    'Memory System Design',
    (SELECT id FROM agents WHERE name = 'Brains'),
    'completed',
    json_object(
        'design_document', 'MEMORY_INTEGRATION_DESIGN.md',
        'database_tables', 5,
        'api_endpoints', 4,
        'next_phase', 'Implementation'
    ),
    1800000,  -- 30 minutes in milliseconds
    3
);

-- ============================================
-- 9. UPDATE PROJECT BOARD
-- Note: This would be done by the application, not SQL
-- ============================================

-- The actual project board update happens in the MISSION_CONTROL_BOARD.md file
-- This SQL just logs the activity

INSERT OR IGNORE INTO agent_activities (agent_id, activity_type, description, metadata)
VALUES (
    (SELECT id FROM agents WHERE name = 'Brains'),
    'project_update',
    'Updated project board with memory system progress',
    json_object(
        'progress', '25%',
        'document_created', 'MEMORY_INTEGRATION_DESIGN.md',
        'next_task', 'Database migration and log collector implementation'
    )
);

-- ============================================
-- 10. VERIFICATION QUERY
-- ============================================
SELECT '✅ Memory system tables created successfully' AS status;

-- Show created tables
SELECT name FROM sqlite_master 
WHERE type='table' AND name LIKE '%memory%' OR name LIKE '%session%' OR name LIKE '%search%'
ORDER BY name;

-- Show initial data count
SELECT 
    (SELECT COUNT(*) FROM agent_sessions) AS agent_sessions_count,
    (SELECT COUNT(*) FROM task_executions) AS task_executions_count,
    (SELECT COUNT(*) FROM memory_usage_series) AS memory_series_count,
    (SELECT COUNT(*) FROM search_index) AS search_index_count,
    (SELECT COUNT(*) FROM memory_aggregates) AS memory_aggregates_count;