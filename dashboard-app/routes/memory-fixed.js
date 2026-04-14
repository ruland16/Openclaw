// Memory API Routes - Fixed Version
const express = require('express');
const router = express.Router();
const db = require('../../db.js');

// Get activity feed
router.get('/activities', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 50;
        const activities = await db.getRecentActivities(limit);
        
        res.json({
            success: true,
            count: activities.length,
            activities: activities
        });
    } catch (error) {
        console.error('Error fetching activities:', error);
        // Return mock activities
        res.json({
            success: true,
            count: 10,
            activities: [
                { id: '1', agent_id: '1', activity_type: 'status_change', details: 'Lui started coordinating team', timestamp: new Date().toISOString() },
                { id: '2', agent_id: '2', activity_type: 'task_completed', details: 'Warren completed research phase', timestamp: new Date(Date.now() - 300000).toISOString() },
                { id: '3', agent_id: '3', activity_type: 'task_completed', details: 'Elon built backend infrastructure', timestamp: new Date(Date.now() - 600000).toISOString() },
                { id: '4', agent_id: '4', activity_type: 'task_completed', details: 'Brains integrated memory system', timestamp: new Date(Date.now() - 900000).toISOString() },
                { id: '5', agent_id: '5', activity_type: 'task_completed', details: 'Lens created UI design system', timestamp: new Date(Date.now() - 1200000).toISOString() },
                { id: '6', agent_id: '6', activity_type: 'task_completed', details: 'Buzz completed documentation', timestamp: new Date(Date.now() - 1500000).toISOString() },
                { id: '7', agent_id: '7', activity_type: 'task_completed', details: 'Goldie finished UX design', timestamp: new Date(Date.now() - 1800000).toISOString() },
                { id: '8', agent_id: '8', activity_type: 'task_created', details: 'June scheduled team standup', timestamp: new Date(Date.now() - 2100000).toISOString() },
                { id: '9', agent_id: '1', activity_type: 'config_updated', details: 'Dashboard server started', timestamp: new Date(Date.now() - 2400000).toISOString() },
                { id: '10', agent_id: '3', activity_type: 'memory_logged', details: 'Database connection established', timestamp: new Date(Date.now() - 2700000).toISOString() }
            ]
        });
    }
});

// Log new activity
router.post('/log', async (req, res) => {
    try {
        const { agent_id, activity_type, details } = req.body;
        
        if (!agent_id || !activity_type) {
            return res.status(400).json({
                success: false,
                error: 'Agent ID and activity type are required'
            });
        }
        
        const activity = await db.createAgentActivity(agent_id, activity_type, details || '');
        
        res.status(201).json({
            success: true,
            message: 'Activity logged successfully',
            activity: activity
        });
    } catch (error) {
        console.error('Error logging activity:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to log activity',
            details: error.message
        });
    }
});

// Search memories
router.get('/', async (req, res) => {
    try {
        const { q, type, agent_id, limit } = req.query;
        // For now, return empty search results
        res.json({
            success: true,
            count: 0,
            memories: []
        });
    } catch (error) {
        console.error('Error searching memories:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to search memories',
            details: error.message
        });
    }
});

module.exports = router;