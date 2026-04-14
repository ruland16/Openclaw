# Mission Control Dashboard - Database Schema Design

## Database Choice: SQLite
**Rationale:**
- Simple setup, no external dependencies
- File-based, easy to backup and migrate
- Good performance for moderate loads
- Can be migrated to PostgreSQL later if needed

## Core Tables

### 1. `agents` - Agent Information
```sql
CREATE TABLE agents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,           -- Agent name (Lui, Warren, Elon, etc.)
    role TEXT NOT NULL,                  -- Role description
    status TEXT DEFAULT 'inactive',      -- active, inactive, busy, error
    last_seen TIMESTAMP,                 -- Last heartbeat/activity
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 2. `agent_activities` - Real-time Activity Logging
```sql
CREATE TABLE agent_activities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    agent_id INTEGER NOT NULL,
    activity_type TEXT NOT NULL,         -- task_started, task_completed, message_sent, error_occurred, etc.
    description TEXT,                    -- Human-readable description
    metadata JSON,                       -- Additional structured data
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (agent_id) REFERENCES agents(id)
);

CREATE INDEX idx_agent_activities_agent_id ON agent_activities(agent_id);
CREATE INDEX idx_agent_activities_timestamp ON agent_activities(timestamp);
```

### 3. `tasks` - Task Management
```sql
CREATE TABLE tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    assigned_to INTEGER,                 -- Agent ID
    created_by INTEGER NOT NULL,         -- Agent ID who created the task
    status TEXT DEFAULT 'pending',       -- pending, in_progress, completed, blocked
    priority TEXT DEFAULT 'medium',      -- low, medium, high, critical
    due_date TIMESTAMP,
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (assigned_to) REFERENCES agents(id),
    FOREIGN KEY (created_by) REFERENCES agents(id)
);

CREATE INDEX idx_tasks_assigned_to ON tasks(assigned_to);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);
```

### 4. `task_updates` - Task Progress Tracking
```sql
CREATE TABLE task_updates (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    task_id INTEGER NOT NULL,
    agent_id INTEGER NOT NULL,           -- Who made the update
    update_type TEXT NOT NULL,           -- status_change, comment, attachment, etc.
    content TEXT,                        -- Update content/comment
    metadata JSON,                       -- Additional data (old_status, new_status, etc.)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (task_id) REFERENCES tasks(id),
    FOREIGN KEY (agent_id) REFERENCES(id)
);

CREATE INDEX idx_task_updates_task_id ON task_updates(task_id);
CREATE INDEX idx_task_updates_created_at ON task_updates(created_at);
```

### 5. `system_metrics` - Performance Metrics
```sql
CREATE TABLE system_metrics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    metric_type TEXT NOT NULL,           -- cpu_usage, memory_usage, response_time, etc.
    agent_id INTEGER,                    -- NULL for system-wide metrics
    value REAL NOT NULL,
    unit TEXT,                           -- %, MB, ms, etc.
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (agent_id) REFERENCES agents(id)
);

CREATE INDEX idx_system_metrics_timestamp ON system_metrics(timestamp);
CREATE INDEX idx_system_metrics_agent_id ON system_metrics(agent_id);
```

### 6. `memory_entries` - Agent Memory Integration
```sql
CREATE TABLE memory_entries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    agent_id INTEGER NOT NULL,
    entry_type TEXT NOT NULL,            -- note, decision, lesson, todo, etc.
    content TEXT NOT NULL,
    tags JSON,                           -- Array of tags for categorization
    importance INTEGER DEFAULT 1,        -- 1-5 scale
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (agent_id) REFERENCES agents(id)
);

CREATE INDEX idx_memory_entries_agent_id ON memory_entries(agent_id);
CREATE INDEX idx_memory_entries_entry_type ON memory_entries(entry_type);
CREATE INDEX idx_memory_entries_created_at ON memory_entries(created_at);
```

### 7. `websocket_connections` - Real-time Connection Tracking
```sql
CREATE TABLE websocket_connections (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    connection_id TEXT NOT NULL UNIQUE,  -- WebSocket connection ID
    agent_id INTEGER,                    -- Associated agent (if authenticated)
    client_type TEXT,                    -- dashboard, agent, external
    ip_address TEXT,
    user_agent TEXT,
    connected_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    disconnected_at TIMESTAMP,
    last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (agent_id) REFERENCES agents(id)
);

CREATE INDEX idx_websocket_connections_agent_id ON websocket_connections(agent_id);
CREATE INDEX idx_websocket_connections_connected_at ON websocket_connections(connected_at);
```

## Views for Common Queries

### 1. `agent_status_view` - Current Agent Status
```sql
CREATE VIEW agent_status_view AS
SELECT 
    a.id,
    a.name,
    a.role,
    a.status,
    a.last_seen,
    COUNT(DISTINCT t.id) as active_tasks,
    COUNT(DISTINCT CASE WHEN t.status = 'completed' THEN t.id END) as completed_tasks,
    MAX(aa.timestamp) as last_activity
FROM agents a
LEFT JOIN tasks t ON t.assigned_to = a.id AND t.status IN ('pending', 'in_progress')
LEFT JOIN agent_activities aa ON aa.agent_id = a.id
GROUP BY a.id, a.name, a.role, a.status, a.last_seen;
```

### 2. `project_progress_view` - Overall Project Progress
```sql
CREATE VIEW project_progress_view AS
SELECT
    DATE(created_at) as date,
    COUNT(*) as total_tasks,
    COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_tasks,
    COUNT(CASE WHEN status = 'in_progress' THEN 1 END) as in_progress_tasks,
    COUNT(CASE WHEN status = 'blocked' THEN 1 END) as blocked_tasks,
    ROUND(COUNT(CASE WHEN status = 'completed' THEN 1 END) * 100.0 / COUNT(*), 2) as completion_rate
FROM tasks
GROUP BY DATE(created_at)
ORDER BY date DESC;
```

## Initial Data

### Seed Agents
```sql
INSERT INTO agents (name, role, status, created_at) VALUES
('Lui', 'COO/Orchestrator', 'active', CURRENT_TIMESTAMP),
('Warren', 'Strategy Chief', 'inactive', CURRENT_TIMESTAMP),
('Elon', 'CTO', 'active', CURRENT_TIMESTAMP),
('Brains', 'CMO (Chief Memory Officer)', 'inactive', CURRENT_TIMESTAMP),
('Lens', 'Media Producer', 'inactive', CURRENT_TIMESTAMP),
('Buzz', 'CCO YouTube', 'inactive', CURRENT_TIMESTAMP),
('Goldie', 'Marketing Chief', 'inactive', CURRENT_TIMESTAMP),
('June', 'Personal Life Manager', 'inactive', CURRENT_TIMESTAMP);
```

## Migration Strategy

1. **Phase 1:** SQLite for development and initial deployment
2. **Phase 2:** PostgreSQL migration script when needed
3. **Schema Versioning:** Use `schema_migrations` table to track migrations

```sql
CREATE TABLE schema_migrations (
    version TEXT PRIMARY KEY,
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Next Steps
1. Create SQLite database file
2. Implement database initialization script
3. Create data access layer (DAL)
4. Implement real-time data collection hooks
5. Build REST API endpoints
6. Set up WebSocket server