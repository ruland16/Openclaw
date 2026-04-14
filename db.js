/**
 * Mission Control Dashboard - Database Layer
 * Data Access Layer for SQLite database operations
 */

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const DB_PATH = path.join(__dirname, 'mission_control.db');

class Database {
    constructor() {
        this.db = null;
        this.initialized = false;
    }

    /**
     * Initialize database connection
     */
    async init() {
        return new Promise((resolve, reject) => {
            this.db = new sqlite3.Database(DB_PATH, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
                if (err) {
                    console.error('❌ Error opening database:', err.message);
                    reject(err);
                    return;
                }
                
                console.log('✅ Connected to SQLite database');
                this.initialized = true;
                
                // Enable foreign keys
                this.db.run('PRAGMA foreign_keys = ON', (err) => {
                    if (err) {
                        console.warn('⚠️  Could not enable foreign keys:', err.message);
                    }
                    resolve();
                });
            });
        });
    }

    /**
     * Execute a SQL query with parameters
     */
    async run(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.run(sql, params, function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve({ lastID: this.lastID, changes: this.changes });
                }
            });
        });
    }

    /**
     * Get a single row
     */
    async get(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.get(sql, params, (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });
    }

    /**
     * Get multiple rows
     */
    async all(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.all(sql, params, (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    /**
     * Close database connection
     */
    async close() {
        return new Promise((resolve, reject) => {
            this.db.close((err) => {
                if (err) {
                    reject(err);
                } else {
                    console.log('🔒 Database connection closed');
                    this.initialized = false;
                    resolve();
                }
            });
        });
    }

    // ==================== AGENT OPERATIONS ====================

    /**
     * Get all agents
     */
    async getAgents() {
        return this.all(`
            SELECT id, name, role, status, last_seen, created_at, updated_at
            FROM agents
            ORDER BY name
        `);
    }

    /**
     * Get agent by ID
     */
    async getAgentById(id) {
        return this.get(`
            SELECT id, name, role, status, last_seen, created_at, updated_at
            FROM agents
            WHERE id = ?
        `, [id]);
    }

    /**
     * Get agent by name
     */
    async getAgentByName(name) {
        return this.get(`
            SELECT id, name, role, status, last_seen, created_at, updated_at
            FROM agents
            WHERE name = ?
        `, [name]);
    }

    /**
     * Update agent status
     */
    async updateAgentStatus(id, status) {
        return this.run(`
            UPDATE agents
            SET status = ?, last_seen = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `, [status, id]);
    }

    /**
     * Create agent activity log
     */
    async createAgentActivity(agentId, activityType, description, metadata = {}) {
        return this.run(`
            INSERT INTO agent_activities (agent_id, activity_type, description, metadata)
            VALUES (?, ?, ?, ?)
        `, [agentId, activityType, description, JSON.stringify(metadata)]);
    }

    /**
     * Get agent activities
     */
    async getAgentActivities(agentId, limit = 50) {
        return this.all(`
            SELECT id, activity_type, description, metadata, timestamp
            FROM agent_activities
            WHERE agent_id = ?
            ORDER BY timestamp DESC
            LIMIT ?
        `, [agentId, limit]);
    }

    /**
     * Get recent activities for all agents
     */
    async getRecentActivities(limit = 100) {
        return this.all(`
            SELECT 
                aa.id,
                aa.agent_id,
                a.name as agent_name,
                aa.activity_type,
                aa.description,
                aa.metadata,
                aa.timestamp
            FROM agent_activities aa
            JOIN agents a ON aa.agent_id = a.id
            ORDER BY aa.timestamp DESC
            LIMIT ?
        `, [limit]);
    }

    // ==================== TASK OPERATIONS ====================

    /**
     * Get all tasks
     */
    async getTasks(filters = {}) {
        let sql = `
            SELECT 
                t.id,
                t.title,
                t.description,
                t.status,
                t.priority,
                t.due_date,
                t.completed_at,
                t.created_at,
                t.updated_at,
                a_assigned.name as assigned_to_name,
                a_created.name as created_by_name
            FROM tasks t
            LEFT JOIN agents a_assigned ON t.assigned_to = a_assigned.id
            LEFT JOIN agents a_created ON t.created_by = a_created.id
            WHERE 1=1
        `;
        
        const params = [];
        
        if (filters.status) {
            sql += ' AND t.status = ?';
            params.push(filters.status);
        }
        
        if (filters.assigned_to) {
            sql += ' AND t.assigned_to = ?';
            params.push(filters.assigned_to);
        }
        
        if (filters.priority) {
            sql += ' AND t.priority = ?';
            params.push(filters.priority);
        }
        
        sql += ' ORDER BY t.priority DESC, t.created_at DESC';
        
        return this.all(sql, params);
    }

    /**
     * Create a new task
     */
    async createTask(taskData) {
        const { title, description, assigned_to, created_by, priority = 'medium', due_date } = taskData;
        
        return this.run(`
            INSERT INTO tasks (title, description, assigned_to, created_by, priority, due_date)
            VALUES (?, ?, ?, ?, ?, ?)
        `, [title, description, assigned_to, created_by, priority, due_date]);
    }

    /**
     * Update task status
     */
    async updateTaskStatus(taskId, status) {
        const updates = {
            status,
            updated_at: 'CURRENT_TIMESTAMP'
        };
        
        if (status === 'completed') {
            updates.completed_at = 'CURRENT_TIMESTAMP';
        }
        
        const setClause = Object.keys(updates).map(key => `${key} = ${updates[key]}`).join(', ');
        
        return this.run(`
            UPDATE tasks
            SET ${setClause}
            WHERE id = ?
        `, [taskId]);
    }

    /**
     * Add task update/comment
     */
    async addTaskUpdate(taskId, agentId, updateType, content, metadata = {}) {
        return this.run(`
            INSERT INTO task_updates (task_id, agent_id, update_type, content, metadata)
            VALUES (?, ?, ?, ?, ?)
        `, [taskId, agentId, updateType, content, JSON.stringify(metadata)]);
    }

    // ==================== DASHBOARD DATA ====================

    /**
     * Get dashboard statistics
     */
    async getDashboardStats() {
        const stats = {};
        
        // Agent statistics
        const agentStats = await this.get(`
            SELECT 
                COUNT(*) as total_agents,
                COUNT(CASE WHEN status = 'active' THEN 1 END) as active_agents,
                COUNT(CASE WHEN status = 'inactive' THEN 1 END) as inactive_agents,
                COUNT(CASE WHEN status = 'busy' THEN 1 END) as busy_agents,
                COUNT(CASE WHEN status = 'error' THEN 1 END) as error_agents
            FROM agents
        `);
        
        // Task statistics
        const taskStats = await this.get(`
            SELECT 
                COUNT(*) as total_tasks,
                COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_tasks,
                COUNT(CASE WHEN status = 'in_progress' THEN 1 END) as in_progress_tasks,
                COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_tasks,
                COUNT(CASE WHEN status = 'blocked' THEN 1 END) as blocked_tasks
            FROM tasks
        `);
        
        // Recent activity count
        const recentActivity = await this.get(`
            SELECT COUNT(*) as recent_activities
            FROM agent_activities
            WHERE timestamp > datetime('now', '-24 hours')
        `);
        
        return {
            agents: agentStats,
            tasks: taskStats,
            recent_activities: recentActivity.recent_activities,
            updated_at: new Date().toISOString()
        };
    }

    /**
     * Get agent status view
     */
    async getAgentStatusView() {
        return this.all(`
            SELECT * FROM agent_status_view
            ORDER BY 
                CASE status
                    WHEN 'active' THEN 1
                    WHEN 'busy' THEN 2
                    WHEN 'inactive' THEN 3
                    WHEN 'error' THEN 4
                    ELSE 5
                END,
                name
        `);
    }

    /**
     * Get project progress view
     */
    async getProjectProgressView(days = 7) {
        return this.all(`
            SELECT * FROM project_progress_view
            WHERE date >= date('now', ?)
            ORDER BY date DESC
        `, [`-${days} days`]);
    }

    // ==================== SYSTEM METRICS ====================

    /**
     * Record system metric
     */
    async recordMetric(metricType, value, unit, agentId = null) {
        return this.run(`
            INSERT INTO system_metrics (metric_type, agent_id, value, unit)
            VALUES (?, ?, ?, ?)
        `, [metricType, agentId, value, unit]);
    }

    /**
     * Get recent metrics
     */
    async getRecentMetrics(metricType = null, agentId = null, limit = 100) {
        let sql = `
            SELECT id, metric_type, agent_id, value, unit, timestamp
            FROM system_metrics
            WHERE 1=1
        `;
        
        const params = [];
        
        if (metricType) {
            sql += ' AND metric_type = ?';
            params.push(metricType);
        }
        
        if (agentId) {
            sql += ' AND agent_id = ?';
            params.push(agentId);
        }
        
        sql += ' ORDER BY timestamp DESC LIMIT ?';
        params.push(limit);
        
        return this.all(sql, params);
    }

    // ==================== MEMORY ENTRIES ====================

    /**
     * Create memory entry
     */
    async createMemoryEntry(agentId, entryType, content, tags = [], importance = 1) {
        return this.run(`
            INSERT INTO memory_entries (agent_id, entry_type, content, tags, importance)
            VALUES (?, ?, ?, ?, ?)
        `, [agentId, entryType, content, JSON.stringify(tags), importance]);
    }

    /**
     * Search memory entries
     */
    async searchMemoryEntries(query, agentId = null, limit = 50) {
        let sql = `
            SELECT id, agent_id, entry_type, content, tags, importance, created_at
            FROM memory_entries
            WHERE content LIKE ?
        `;
        
        const params = [`%${query}%`];
        
        if (agentId) {
            sql += ' AND agent_id = ?';
            params.push(agentId);
        }
        
        sql += ' ORDER BY importance DESC, created_at DESC LIMIT ?';
        params.push(limit);
        
        return this.all(sql, params);
    }

    // ==================== WEBSOCKET CONNECTIONS ====================

    /**
     * Record WebSocket connection
     */
    async recordWebSocketConnection(connectionId, agentId = null, clientType = null, ipAddress = null, userAgent = null) {
        return this.run(`
            INSERT INTO websocket_connections (connection_id, agent_id, client_type, ip_address, user_agent)
            VALUES (?, ?, ?, ?, ?)
        `, [connectionId, agentId, clientType, ipAddress, userAgent]);
    }

    /**
     * Update WebSocket connection activity
     */
    async updateWebSocketActivity(connectionId) {
        return this.run(`
            UPDATE websocket_connections
            SET last_activity = CURRENT_TIMESTAMP
            WHERE connection_id = ?
        `, [connectionId]);
    }

    /**
     * Record WebSocket disconnection
     */
    async recordWebSocketDisconnection(connectionId) {
        return this.run(`
            UPDATE websocket_connections
            SET disconnected_at = CURRENT_TIMESTAMP
            WHERE connection_id = ? AND disconnected_at IS NULL
        `, [connectionId]);
    }

    /**
     * Get active WebSocket connections
     */
    async getActiveWebSocketConnections() {
        return this.all(`
            SELECT 
                wc.connection_id,
                wc.agent_id,
                a.name as agent_name,
                wc.client_type,
                wc.ip_address,
                wc.connected_at,
                wc.last_activity
            FROM websocket_connections wc
            LEFT JOIN agents a ON wc.agent_id = a.id
            WHERE wc.disconnected_at IS NULL
            ORDER BY wc.last_activity DESC
        `);
    }
}

// Create singleton instance
const db = new Database();

module.exports = db;