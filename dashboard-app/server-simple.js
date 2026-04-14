// Simple Mission Control Dashboard Server
const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const PORT = 3000;

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Basic API endpoints
app.get('/api/agents', (req, res) => {
    res.json({
        success: true,
        count: 8,
        agents: [
            { id: '1', name: 'Lui', role: 'COO / Orchestrator', status: 'active', last_updated: new Date().toISOString() },
            { id: '2', name: 'Warren', role: 'Strategy Chief', status: 'active', last_updated: new Date().toISOString() },
            { id: '3', name: 'Elon', role: 'CTO', status: 'active', last_updated: new Date().toISOString() },
            { id: '4', name: 'Brains', role: 'CMO', status: 'active', last_updated: new Date().toISOString() },
            { id: '5', name: 'Lens', role: 'Media Producer', status: 'active', last_updated: new Date().toISOString() },
            { id: '6', name: 'Buzz', role: 'CCO', status: 'active', last_updated: new Date().toISOString() },
            { id: '7', name: 'Goldie', role: 'Marketing Chief', status: 'active', last_updated: new Date().toISOString() },
            { id: '8', name: 'June', role: 'Life Manager', status: 'active', last_updated: new Date().toISOString() }
        ]
    });
});

app.get('/api/tasks', (req, res) => {
    res.json({
        success: true,
        count: 3,
        tasks: [
            { id: '1', title: 'Research mission control patterns', status: 'completed', assigned_to: '2' },
            { id: '2', title: 'Build dashboard backend', status: 'in_progress', assigned_to: '3' },
            { id: '3', title: 'Design UI components', status: 'in_progress', assigned_to: '5' }
        ]
    });
});

app.get('/api/memory/activities', (req, res) => {
    res.json({
        success: true,
        count: 5,
        activities: [
            { agent_id: '1', activity_type: 'status_change', details: 'Dashboard started', timestamp: new Date().toISOString() },
            { agent_id: '2', activity_type: 'task_completed', details: 'Research completed', timestamp: new Date(Date.now() - 300000).toISOString() },
            { agent_id: '3', activity_type: 'task_completed', details: 'Backend built', timestamp: new Date(Date.now() - 600000).toISOString() },
            { agent_id: '5', activity_type: 'task_completed', details: 'UI designed', timestamp: new Date(Date.now() - 900000).toISOString() },
            { agent_id: '6', activity_type: 'task_completed', details: 'Documentation finished', timestamp: new Date(Date.now() - 1200000).toISOString() }
        ]
    });
});

app.get('/api/metrics', (req, res) => {
    res.json({
        success: true,
        metrics: {
            active_agents: 8,
            total_tasks: 15,
            completed_tasks: 12,
            avg_response_time: 142
        }
    });
});

app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        websocket_clients: wss.clients.size
    });
});

// WebSocket handling
wss.on('connection', (ws, req) => {
    const clientIp = req.socket.remoteAddress;
    console.log(`✅ New WebSocket client connected from ${clientIp}`);
    console.log(`   Total clients: ${wss.clients.size}`);
    
    // Send welcome message
    ws.send(JSON.stringify({
        type: 'connection_established',
        message: 'Connected to Mission Control Dashboard',
        timestamp: new Date().toISOString(),
        clientCount: wss.clients.size
    }));
    
    // Send initial data
    setTimeout(() => {
        ws.send(JSON.stringify({
            type: 'agent_status_updated',
            agentId: '1',
            status: 'active',
            timestamp: new Date().toISOString()
        }));
    }, 1000);
    
    // Handle messages from client
    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message);
            console.log('Received WebSocket message:', data.type);
            
            // Echo back for testing
            if (data.type === 'ping') {
                ws.send(JSON.stringify({
                    type: 'pong',
                    timestamp: new Date().toISOString()
                }));
            }
        } catch (error) {
            console.error('Error parsing WebSocket message:', error);
        }
    });
    
    ws.on('close', () => {
        console.log('WebSocket client disconnected');
    });
});

// Start server
server.listen(PORT, () => {
    console.log(`🚀 Mission Control Dashboard (Simple) running on port ${PORT}`);
    console.log(`📊 Dashboard: http://localhost:${PORT}`);
    console.log(`🔌 WebSocket: ws://localhost:${PORT}`);
    console.log(`📚 API: http://localhost:${PORT}/api`);
    console.log(`🏥 Health: http://localhost:${PORT}/health`);
});