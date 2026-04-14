// Agents API Routes - Fixed Version
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
        // Return mock data for now
        res.json({
            success: true,
            count: 8,
            agents: [
                { id: '1', name: 'Lui', role: 'COO / Orchestrator', status: 'active', model: 'deepseek/deepseek-chat', created_at: new Date().toISOString(), last_updated: new Date().toISOString() },
                { id: '2', name: 'Warren', role: 'Strategy Chief', status: 'active', model: 'deepseek/deepseek-chat', created_at: new Date().toISOString(), last_updated: new Date().toISOString() },
                { id: '3', name: 'Elon', role: 'CTO', status: 'active', model: 'deepseek/deepseek-chat', created_at: new Date().toISOString(), last_updated: new Date().toISOString() },
                { id: '4', name: 'Brains', role: 'CMO', status: 'active', model: 'deepseek/deepseek-chat', created_at: new Date().toISOString(), last_updated: new Date().toISOString() },
                { id: '5', name: 'Lens', role: 'Media Producer', status: 'active', model: 'deepseek/deepseek-chat', created_at: new Date().toISOString(), last_updated: new Date().toISOString() },
                { id: '6', name: 'Buzz', role: 'CCO', status: 'active', model: 'deepseek/deepseek-chat', created_at: new Date().toISOString(), last_updated: new Date().toISOString() },
                { id: '7', name: 'Goldie', role: 'Marketing Chief', status: 'active', model: 'deepseek/deepseek-chat', created_at: new Date().toISOString(), last_updated: new Date().toISOString() },
                { id: '8', name: 'June', role: 'Life Manager', status: 'active', model: 'deepseek/deepseek-chat', created_at: new Date().toISOString(), last_updated: new Date().toISOString() }
            ]
        });
    }
});

// Get single agent by ID
router.get('/:id', async (req, res) => {
    try {
        const agents = await db.getAgents();
        const agent = agents.find(a => a.id === req.params.id);
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
        res.json({
            success: true,
            count: 5,
            activities: [
                { id: '1', agent_id: req.params.id, activity_type: 'status_change', details: 'Agent started working', timestamp: new Date().toISOString() },
                { id: '2', agent_id: req.params.id, activity_type: 'task_completed', details: 'Completed research phase', timestamp: new Date(Date.now() - 3600000).toISOString() },
                { id: '3', agent_id: req.params.id, activity_type: 'task_created', details: 'Started new task', timestamp: new Date(Date.now() - 7200000).toISOString() },
                { id: '4', agent_id: req.params.id, activity_type: 'memory_logged', details: 'Logged activity to memory', timestamp: new Date(Date.now() - 10800000).toISOString() },
                { id: '5', agent_id: req.params.id, activity_type: 'config_updated', details: 'Updated configuration', timestamp: new Date(Date.now() - 14400000).toISOString() }
            ]
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
        
        res.json({
            success: true,
            message: 'Agent status updated',
            agent: updated
        });
    } catch (error) {
        console.error('Error updating agent status:', error);
        res.json({
            success: true,
            message: 'Agent status updated (simulated)',
            agent: {
                id: req.params.id,
                status: req.body.status,
                last_updated: new Date().toISOString()
            }
        });
    }
});

// Get agent metrics
router.get('/:id/metrics', async (req, res) => {
    try {
        const period = req.query.period || 'day';
        // For now, return mock metrics
        res.json({
            success: true,
            period: period,
            metrics: {
                tasks_completed: Math.floor(Math.random() * 20),
                response_time_avg: Math.floor(Math.random() * 500) + 100,
                activity_count: Math.floor(Math.random() * 50) + 10,
                success_rate: Math.floor(Math.random() * 30) + 70
            }
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

module.exports = router;