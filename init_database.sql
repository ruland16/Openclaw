-- Mission Control Dashboard Database Initialization
-- SQLite Schema Creation

-- Enable foreign keys
PRAGMA foreign_keys = ON;

-- Create agents table
CREATE TABLE IF NOT EXISTS agents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    role TEXT NOT NULL,
    status TEXT DEFAULT 'inactive',
    last_seen TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create agent_activities table
CREATE TABLE IF NOT EXISTS agent_activities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    agent_id INTEGER NOT NULL,
    activity_type TEXT NOT NULL,
    description TEXT,
    metadata TEXT,  -- JSON stored as TEXT in SQLite
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (agent_id) REFERENCES agents(id) ON DELETE CASCADE
);

-- Create tasks table
CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    assigned_to INTEGER,
    created_by INTEGER NOT NULL,
    status TEXT DEFAULT 'pending',
    priority TEXT DEFAULT 'medium',
    due_date TIMESTAMP,
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (assigned_to) REFERENCES agents(id) ON DELETE SET NULL,
    FOREIGN KEY (created_by) REFERENCES agents(id) ON DELETE CASCADE
);

-- Create task_updates table
CREATE TABLE IF NOT EXISTS task_updates (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    task_id INTEGER NOT NULL,
    agent_id INTEGER NOT NULL,
    update_type TEXT NOT NULL,
    content TEXT,
    metadata TEXT,  -- JSON stored as TEXT in SQLite
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE,
    FOREIGN KEY (agent_id) REFERENCES agents(id) ON DELETE CASCADE
);

-- Create system_metrics table
CREATE TABLE IF NOT EXISTS system_metrics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    metric_type TEXT NOT NULL,
    agent_id INTEGER,
    value REAL NOT NULL,
    unit TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (agent_id) REFERENCES agents(id) ON DELETE CASCADE
);

-- Create memory_entries table
CREATE TABLE IF NOT EXISTS memory_entries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    agent_id INTEGER NOT NULL,
    entry_type TEXT NOT NULL,
    content TEXT NOT NULL,
    tags TEXT,  -- JSON array stored as TEXT
    importance INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (agent_id) REFERENCES agents(id) ON DELETE CASCADE
);

-- Create websocket_connections table
CREATE TABLE IF NOT EXISTS websocket_connections (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    connection_id TEXT NOT NULL UNIQUE,
    agent_id INTEGER,
    client_type TEXT,
    ip_address TEXT,
    user_agent TEXT,
    connected_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    disconnected_at TIMESTAMP,
    last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (agent_id) REFERENCES agents(id) ON DELETE SET NULL
);

-- Create schema_migrations table
CREATE TABLE IF NOT EXISTS schema_migrations (
    version TEXT PRIMARY KEY,
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_agent_activities_agent_id ON agent_activities(agent_id);
CREATE INDEX IF NOT EXISTS idx_agent_activities_timestamp ON agent_activities(timestamp);
CREATE INDEX IF NOT EXISTS idx_agent_activities_type ON agent_activities(activity_type);

CREATE INDEX IF NOT EXISTS idx_tasks_assigned_to ON tasks(assigned_to);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_priority ON tasks(priority);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON tasks(due_date);
CREATE INDEX IF NOT EXISTS idx_tasks_created_by ON tasks(created_by);

CREATE INDEX IF NOT EXISTS idx_task_updates_task_id ON task_updates(task_id);
CREATE INDEX IF NOT EXISTS idx_task_updates_agent_id ON task_updates(agent_id);
CREATE INDEX IF NOT EXISTS idx_task_updates_created_at ON task_updates(created_at);

CREATE INDEX IF NOT EXISTS idx_system_metrics_timestamp ON system_metrics(timestamp);
CREATE INDEX IF NOT EXISTS idx_system_metrics_agent_id ON system_metrics(agent_id);
CREATE INDEX IF NOT EXISTS idx_system_metrics_type ON system_metrics(metric_type);

CREATE INDEX IF NOT EXISTS idx_memory_entries_agent_id ON memory_entries(agent_id);
CREATE INDEX IF NOT EXISTS idx_memory_entries_entry_type ON memory_entries(entry_type);
CREATE INDEX IF NOT EXISTS idx_memory_entries_created_at ON memory_entries(created_at);
CREATE INDEX IF NOT EXISTS idx_memory_entries_importance ON memory_entries(importance);

CREATE INDEX IF NOT EXISTS idx_websocket_connections_agent_id ON websocket_connections(agent_id);
CREATE INDEX IF NOT EXISTS idx_websocket_connections_connected_at ON websocket_connections(connected_at);
CREATE INDEX IF NOT EXISTS idx_websocket_connections_client_type ON websocket_connections(client_type);

-- Create views
CREATE VIEW IF NOT EXISTS agent_status_view AS
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

CREATE VIEW IF NOT EXISTS project_progress_view AS
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

-- Insert initial agent data
INSERT OR IGNORE INTO agents (name, role, status) VALUES
('Lui', 'COO/Orchestrator', 'active'),
('Warren', 'Strategy Chief', 'inactive'),
('Elon', 'CTO', 'active'),
('Brains', 'CMO (Chief Memory Officer)', 'inactive'),
('Lens', 'Media Producer', 'inactive'),
('Buzz', 'CCO YouTube', 'inactive'),
('Goldie', 'Marketing Chief', 'inactive'),
('June', 'Personal Life Manager', 'inactive');

-- Record schema version
INSERT OR IGNORE INTO schema_migrations (version) VALUES ('1.0.0');

-- Create some initial tasks for demonstration
INSERT OR IGNORE INTO tasks (title, description, assigned_to, created_by, status, priority) VALUES
('Design database schema', 'Create SQLite database schema for mission control dashboard', 
 (SELECT id FROM agents WHERE name = 'Elon'),
 (SELECT id FROM agents WHERE name = 'Lui'),
 'in_progress', 'high'),
('Research mission control patterns', 'Research existing OpenClaw mission control tools and best practices',
 (SELECT id FROM agents WHERE name = 'Warren'),
 (SELECT id FROM agents WHERE name = 'Lui'),
 'pending', 'high'),
('Create dashboard UI design', 'Design the user interface for the mission control dashboard',
 (SELECT id FROM agents WHERE name = 'Lens'),
 (SELECT id FROM agents WHERE name = 'Lui'),
 'pending', 'medium');

-- Create initial activity logs
INSERT OR IGNORE INTO agent_activities (agent_id, activity_type, description) VALUES
((SELECT id FROM agents WHERE name = 'Lui'), 'project_started', 'Started Mission Control Dashboard project'),
((SELECT id FROM agents WHERE name = 'Elon'), 'task_started', 'Started database design and implementation'),
((SELECT id FROM agents WHERE name = 'Lui'), 'agent_spawned', 'Spawned Elon as CTO for technical implementation');

-- Update last_seen for active agents
UPDATE agents SET last_seen = CURRENT_TIMESTAMP WHERE name IN ('Lui', 'Elon');

-- Output success message
SELECT 'Database initialized successfully!' as message;