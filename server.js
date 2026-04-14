/**
 * Mission Control Dashboard - Main Server
 * REST API + WebSocket server for real-time agent monitoring
 */

const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');

const db = require('./db');

// Configuration
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || 'localhost';

// Create Express app
const app = express();
const server = http.createServer(app);

// Create WebSocket server
const wss = new WebSocket.Server({ server });

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Initialize database
async function initializeDatabase() {
    try {
        await db.init();
        console.log('✅ Database initialized');
    } catch (error) {
        console.error('❌ Database initialization failed:', error);
        process.exit(1);
    }
}

// WebSocket connection management
const connections = new Map();

wss.on('connection', (ws, req) => {
    const connectionId = generateConnectionId();
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const userAgent = req.headers['user-agent'];
    
    console.log(`🔗 New WebSocket connection: ${connectionId} from ${ip}`);
    
    // Store connection
    connections.set(connectionId, {
        ws,
        ip,
        userAgent,
        connectedAt: new Date(),
        lastActivity: new Date(),
        agentId: null
    });
    
    // Record connection in database
    db.recordWebSocketConnection(connectionId, null, 'dashboard', ip, userAgent)
        .catch(err => console.error('Error recording WebSocket connection:', err));
    
    // Handle messages
    ws.on('message', async (data) => {
        try {
            const message = JSON.parse(data.toString());
            await handleWebSocketMessage(connectionId, message);
            
            // Update last activity
            const connection = connections.get(connectionId);
            if (connection) {
                connection.lastActivity = new Date();
                connections.set(connectionId, connection);
                
                // Update in database
                await db.updateWebSocketActivity(connectionId);
            }
        } catch (error) {
            console.error('Error handling WebSocket message:', error);
        }
    });
    
    // Handle disconnection
    ws.on('close', async () => {
        console.log(`🔌 WebSocket connection closed: ${connectionId}`);
        
        // Record disconnection in database
        await db.recordWebSocketDisconnection(connectionId);
        
        // Remove from connections map
        connections.delete(connectionId);
    });
    
    // Send welcome message
    ws.send(JSON.stringify({
        type: 'welcome',
        connectionId,
        timestamp: new Date().toISOString(),
        message: 'Connected to Mission Control Dashboard'
    }));
});

// Generate unique connection ID
function generateConnectionId() {
    return `conn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Handle WebSocket messages
async function handleWebSocketMessage(connectionId, message) {
    const { type, data } = message;
    const connection = connections.get(connectionId);
    
    switch (type) {
        case 'authenticate':
            // Handle agent authentication
            if (data.agentId) {
                connection.agentId = data.agentId;
                connections.set(connectionId, connection);
                
                // Update database
                await db.run(
                    'UPDATE websocket_connections SET agent_id = ? WHERE connection_id = ?',
                    [data.agentId, connectionId]
                );
                
                // Send confirmation
                connection.ws.send(JSON.stringify({
                    type: 'authenticated',
                    agentId: data.agentId,
                    timestamp: new Date().toISOString()
                }));
                
                // Broadcast agent status update
                broadcastAgentStatusUpdate(data.agentId, 'active');
            }
            break;
            
        case 'agent_activity':
            // Record agent activity
            if (connection.agentId && data.activityType) {
                await db.createAgentActivity(
                    connection.agentId,
                    data.activityType,
                    data.description,
                    data.metadata
                );
                
                // Broadcast activity to all dashboard clients
                broadcastToDashboards({
                    type: 'agent_activity',
                    data: {
                        agentId: connection.agentId,
                        activityType: data.activityType,
                        description: data.description,
                        timestamp: new Date().toISOString()
                    }
                });
            }
            break;
            
        case 'heartbeat':
            // Update agent last_seen
            if (connection.agentId) {
                await db.updateAgentStatus(connection.agentId, 'active');
                
                // Send heartbeat response
                connection.ws.send(JSON.stringify({
                    type: 'heartbeat_response',
                    timestamp: new Date().toISOString()
                }));
            }
            break;
            
        default:
            console.log(`Unknown WebSocket message type: ${type}`);
    }
}

// Broadcast message to all dashboard clients
function broadcastToDashboards(message) {
    const messageStr = JSON.stringify(message);
    
    connections.forEach((connection, connectionId) => {
        if (connection.ws.readyState === WebSocket.OPEN) {
            connection.ws.send(messageStr);
        }
    });
}

// Broadcast agent status update
async function broadcastAgentStatusUpdate(agentId, status) {
    const agent = await db.getAgentById(agentId);
    
    if (agent) {
        broadcastToDashboards({
            type: 'agent_status_update',
            data: {
                agentId,
                name: agent.name,
                status,
                lastSeen: new Date().toISOString()
            }
        });
    }
}

// ==================== REST API ENDPOINTS ====================

// Health check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        connections: connections.size
    });
});

// Get dashboard statistics
app.get('/api/dashboard/stats', async (req, res) => {
    try {
        const stats = await db.getDashboardStats();
        res.json(stats);
    } catch (error) {
        console.error('Error getting dashboard stats:', error);
        res.status(500).json({ error: 'Failed to get dashboard statistics' });
    }
});

// Get all agents
app.get('/api/agents', async (req, res) => {
    try {
        const agents = await db.getAgents();
        res.json(agents);
    } catch (error) {
        console.error('Error getting agents:', error);
        res.status(500).json({ error: 'Failed to get agents' });
    }
});

// Get agent by ID
app.get('/api/agents/:id', async (req, res) => {
    try {
        const agent = await db.getAgentById(req.params.id);
        if (agent) {
            res.json(agent);
        } else {
            res.status(404).json({ error: 'Agent not found' });
        }
    } catch (error) {
        console.error('Error getting agent:', error);
        res.status(500).json({ error: 'Failed to get agent' });
    }
});

// Update agent status
app.patch('/api/agents/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        if (!status) {
            return res.status(400).json({ error: 'Status is required' });
        }
        
        await db.updateAgentStatus(req.params.id, status);
        
        // Broadcast status update
        broadcastAgentStatusUpdate(req.params.id, status);
        
        res.json({ success: true, message: 'Agent status updated' });
    } catch (error) {
        console.error('Error updating agent status:', error);
        res.status(500).json({ error: 'Failed to update agent status' });
    }
});

// Get agent activities
app.get('/api/agents/:id/activities', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 50;
        const activities = await db.getAgentActivities(req.params.id, limit);
        res.json(activities);
    } catch (error) {
        console.error('Error getting agent activities:', error);
        res.status(500).json({ error: 'Failed to get agent activities' });
    }
});

// Get recent activities
app.get('/api/activities/recent', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 100;
        const activities = await db.getRecentActivities(limit);
        res.json(activities);
    } catch (error) {
        console.error('Error getting recent activities:', error);
        res.status(500).json({ error: 'Failed to get recent activities' });
    }
});

// Get all tasks
app.get('/api/tasks', async (req, res) => {
    try {
        const filters = {};
        if (req.query.status) filters.status = req.query.status;
        if (req.query.assigned_to) filters.assigned_to = req.query.assigned_to;
        if (req.query.priority) filters.priority = req.query.priority;
        
        const tasks = await db.getTasks(filters);
        res.json(tasks);
    } catch (error) {
        console.error('Error getting tasks:', error);
        res.status(500).json({ error: 'Failed to get tasks' });
    }
});

// Create new task
app.post('/api/tasks', async (req, res) => {
    try {
        const { title, description, assigned_to, created_by, priority, due_date } = req.body;
        
        if (!title || !created_by) {
            return res.status(400).json({ error: 'Title and created_by are required' });
        }
        
        const result = await db.createTask({
            title,
            description,
            assigned_to,
            created_by,
            priority,
            due_date
        });
        
        // Broadcast task creation
        broadcastToDashboards({
            type: 'task_created',
            data: {
                taskId: result.lastID,
                title,
                assigned_to,
                created_by
            }
        });
        
        res.status(201).json({
            success: true,
            taskId: result.lastID,
            message: 'Task created successfully'
        });
    } catch (error) {
        console.error('Error creating task:', error);
        res.status(500).json({ error: 'Failed to create task' });
    }
});

// Update task status
app.patch('/api/tasks/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        if (!status) {
            return res.status(400).json({ error: 'Status is required' });
        }
        
        await db.updateTaskStatus(req.params.id, status);
        
        // Broadcast task update
        broadcastToDashboards({
            type: 'task_status_updated',
            data: {
                taskId: req.params.id,
                status
            }
        });
        
        res.json({ success: true, message: 'Task status updated' });
    } catch (error) {
        console.error('Error updating task status:', error);
        res.status(500).json({ error: 'Failed to update task status' });
    }
});

// Add task update/comment
app.post('/api/tasks/:id/updates', async (req, res) => {
    try {
        const { agent_id, update_type, content, metadata } = req.body;
        
        if (!agent_id || !update_type) {
            return res.status(400).json({ error: 'agent_id and update_type are required' });
        }
        
        await db.addTaskUpdate(req.params.id, agent_id, update_type, content, metadata);
        
        res.status(201).json({ success: true, message: 'Task update added' });
    } catch (error) {
        console.error('Error adding task update:', error);
        res.status(500).json({ error: 'Failed to add task update' });
    }
});

// Get agent status view
app.get('/api/dashboard/agent-status', async (req, res) => {
    try {
        const agentStatus = await db.getAgentStatusView();
        res.json(agentStatus);
    } catch (error) {
        console.error('Error getting agent status view:', error);
        res.status(500).json({ error: 'Failed to get agent status view' });
    }
});

// Get project progress
app.get('/api/dashboard/project-progress', async (req, res) => {
    try {
        const days = parseInt(req.query.days) || 7;
        const progress = await db.getProjectProgressView(days);
        res.json(progress);
    } catch (error) {
        console.error('Error getting project progress:', error);
        res.status(500).json({ error: 'Failed to get project progress' });
    }
});

// Get active WebSocket connections
app.get('/api/connections/active', async (req, res) => {
    try {
        const connections = await db.getActiveWebSocketConnections();
        res.json(connections);
    } catch (error) {
        console.error('Error getting active connections:', error);
        res.status(500).json({ error: 'Failed to get active connections' });
    }
});

// Search memory entries
app.get('/api/memory/search', async (req, res) => {
    try {
        const { q, agent_id, limit } = req.query;
        
        if (!q) {
            return res.status(400).json({ error: 'Search query (q) is required' });
        }
        
        const results = await db.searchMemoryEntries(
            q,
            agent_id || null,
            parseInt(limit) || 50
        );
        
        res.json(results);
    } catch (error) {
        console.error('Error searching memory:', error);
        res.status(500).json({ error: 'Failed to search memory' });
    }
});

// Record system metric
app.post('/api/metrics', async (req, res) => {
    try {
        const { metric_type, value, unit, agent_id } = req.body;
        
        if (!metric_type || value === undefined) {
            return res.status(400).json({ error: 'metric_type and value are required' });
        }
        
        await db.recordMetric(metric_type, value, unit, agent_id);
        
        res.status(201).json({ success: true, message: 'Metric recorded' });
    } catch (error) {
        console.error('Error recording metric:', error);
        res.status(500).json({ error: 'Failed to record metric' });
    }
});

// Get recent metrics
app.get('/api/metrics/recent', async (req, res) => {
    try {
        const { metric_type, agent_id, limit } = req.query;
        const metrics = await db.getRecentMetrics(
            metric_type || null,
            agent_id || null,
            parseInt(limit) || 100
        );
        res.json(metrics);
    } catch (error) {
        console.error('Error getting metrics:', error);
        res.status(500).json({ error: 'Failed to get metrics' });
    }
});

// API documentation
app.get('/api', (req, res) => {
    res.json({
        name: 'Mission Control Dashboard API',
        version: '1.0.0',
        endpoints: {
            health: '/api/health',
            dashboard: {
                stats: '/api/dashboard/stats',
                agentStatus: '/api/dashboard/agent-status',
                projectProgress: '/api/dashboard/project-progress'
            },
            agents: {
                list: '/api/agents',
                get: '/api/agents/:id',
                updateStatus: '/api/agents/:id/status',
                activities: '/api/agents/:id/activities'
            },
            tasks: {
                list: '/api/tasks',
                create: '/api/tasks',
                updateStatus: '/api/tasks/:id/status',
                addUpdate: '/api/tasks/:id/updates'
            },
            activities: '/api/activities/recent',
            memory: '/api/memory/search',
            metrics: {
                record: '/api/metrics',
                recent: '/api/metrics/recent'
            },
            connections: '/api/connections/active'
        },
        websocket: {
            endpoint: `ws://${HOST}:${PORT}`,
            messageTypes: ['authenticate', 'agent_activity', 'heartbeat']
        }
    });
});

// Start server
async function startServer() {
    await initializeDatabase();
    
    server.listen(PORT, HOST, () => {
        console.log(`🚀 Mission Control Dashboard server running`);
        console.log(`   REST API: http://${HOST}:${PORT}/api`);
        console.log(`   WebSocket: ws://${HOST}:${PORT}`);
        console.log(`   Database: mission_control.db`);
    });
}

// Handle graceful shutdown
process.on('SIGTERM', async () => {
    console.log('🛑 Received SIGTERM, shutting down gracefully...');
    
    // Close all WebSocket connections
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.close();
        }
    });
    
    // Close database connection
    await db.close();
    
    // Close server
    server.close(() => {
        console.log('✅ Server shut down gracefully');
        process.exit(0);
    });
});

// Start the server
startServer().catch(error => {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
});