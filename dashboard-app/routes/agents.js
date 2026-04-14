// Agents API Routes
const express = require('express');
const router = express.Router();
const db = require('../../db.js');

// Get all agents
router.get('/', async (req, res) => {
    try {
        const agents = await db.getAgents();
        res.json({
            success: true,
            count: agents.length,
            agents: agents
        });
    } catch (error) {
        console.error('Error fetching agents:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch agents',
            details: error.message
        });
    }
});

// Get single agent by ID
router.get('/:id', async (req, res) => {
    try {
        const agent = await db.getAgentById(req.params.id);
        if (agent) {
            res.json({
                success: true,
                agent: agent
            });
        } else {
            res.status(404).json({
                success: false,
                error: 'Agent not found'
            });
        }
    } catch (error) {
        console.error('Error fetching agent:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch agent',
            details: error.message
        });
    }
});

// Get agent activities
router.get('/:id/activities', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 50;
        const activities = await db.getAgentActivities(req.params.id, limit);
        res.json({
            success: true,
            count: activities.length,
            activities: activities
        });
    } catch (error) {
        console.error('Error fetching agent activities:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch agent activities',
            details: error.message
        });
    }
});

// Update agent status
router.put('/:id/status', async (req, res) => {
    try {
        const { status, details } = req.body;
        
        if (!status) {
            return res.status(400).json({
                success: false,
                error: 'Status is required'
            });
        }
        
        const updated = await db.updateAgentStatus(req.params.id, status, details || {});
        
        // Log the status change as activity
        await db.logActivity(
            req.params.id,
            'status_change',
            { from: updated.previousStatus, to: status, details: details || {} }
        );
        
        res.json({
            success: true,
            message: 'Agent status updated',
            agent: updated
        });
    } catch (error) {
        console.error('Error updating agent status:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to update agent status',
            details: error.message
        });
    }
});

// Get agent metrics
router.get('/:id/metrics', async (req, res) => {
    try {
        const period = req.query.period || 'day'; // day, week, month
        const metrics = await db.getAgentMetrics(req.params.id, period);
        res.json({
            success: true,
            period: period,
            metrics: metrics
        });
    } catch (error) {
        console.error('Error fetching agent metrics:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch agent metrics',
            details: error.message
        });
    }
});

// Create new agent
router.post('/', async (req, res) => {
    try {
        const { name, role, model, status, config } = req.body;
        
        if (!name || !role) {
            return res.status(400).json({
                success: false,
                error: 'Name and role are required'
            });
        }
        
        const agent = await db.createAgent({
            name,
            role,
            model: model || 'deepseek/deepseek-chat',
            status: status || 'inactive',
            config: config || {}
        });
        
        // Log agent creation
        await db.logActivity(
            agent.id,
            'agent_created',
            { name, role, model: agent.model }
        );
        
        res.status(201).json({
            success: true,
            message: 'Agent created successfully',
            agent: agent
        });
    } catch (error) {
        console.error('Error creating agent:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to create agent',
            details: error.message
        });
    }
});

// Update agent configuration
router.put('/:id/config', async (req, res) => {
    try {
        const { config } = req.body;
        
        if (!config || typeof config !== 'object') {
            return res.status(400).json({
                success: false,
                error: 'Config object is required'
            });
        }
        
        const updated = await db.updateAgentConfig(req.params.id, config);
        
        // Log config change
        await db.logActivity(
            req.params.id,
            'config_updated',
            { config: config }
        );
        
        res.json({
            success: true,
            message: 'Agent configuration updated',
            agent: updated
        });
    } catch (error) {
        console.error('Error updating agent config:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to update agent configuration',
            details: error.message
        });
    }
});

// Get agent connections (WebSocket/network)
router.get('/:id/connections', async (req, res) => {
    try {
        const connections = await db.getAgentConnections(req.params.id);
        res.json({
            success: true,
            count: connections.length,
            connections: connections
        });
    } catch (error) {
        console.error('Error fetching agent connections:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch agent connections',
            details: error.message
        });
    }
});

module.exports = router;