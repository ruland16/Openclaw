// Memory API Routes
const express = require('express');
const router = express.Router();
const db = require('../../db.js');

// Search memories
router.get('/', async (req, res) => {
    try {
        const { q, type, agent_id, limit, offset } = req.query;
        const memories = await db.searchMemories({
            query: q,
            type: type,
            agent_id: agent_id,
            limit: parseInt(limit) || 50,
            offset: parseInt(offset) || 0
        });
        
        res.json({
            success: true,
            count: memories.length,
            memories: memories
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

// Log new memory/activity
router.post('/log', async (req, res) => {
    try {
        const { agent_id, activity_type, details, memory_data } = req.body;
        
        if (!agent_id || !activity_type) {
            return res.status(400).json({
                success: false,
                error: 'Agent ID and activity type are required'
            });
        }
        
        const memory = await db.logActivity(agent_id, activity_type, details, memory_data);
        
        res.status(201).json({
            success: true,
            message: 'Memory logged successfully',
            memory: memory
        });
    } catch (error) {
        console.error('Error logging memory:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to log memory',
            details: error.message
        });
    }
});

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
        res.status(500).json({
            success: false,
            error: 'Failed to fetch activities',
            details: error.message
        });
    }
});

// Get memory by ID
router.get('/:id', async (req, res) => {
    try {
        const memory = await db.getMemoryById(req.params.id);
        if (memory) {
            res.json({
                success: true,
                memory: memory
            });
        } else {
            res.status(404).json({
                success: false,
                error: 'Memory not found'
            });
        }
    } catch (error) {
        console.error('Error fetching memory:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch memory',
            details: error.message
        });
    }
});

// Update memory
router.put('/:id', async (req, res) => {
    try {
        const updates = req.body;
        
        if (Object.keys(updates).length === 0) {
            return res.status(400).json({
                success: false,
                error: 'No updates provided'
            });
        }
        
        const updated = await db.updateMemory(req.params.id, updates);
        
        res.json({
            success: true,
            message: 'Memory updated successfully',
            memory: updated
        });
    } catch (error) {
        console.error('Error updating memory:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to update memory',
            details: error.message
        });
    }
});

// Get memory statistics
router.get('/stats/overview', async (req, res) => {
    try {
        const stats = await db.getMemoryStats();
        res.json({
            success: true,
            stats: stats
        });
    } catch (error) {
        console.error('Error fetching memory stats:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch memory stats',
            details: error.message
        });
    }
});

// Get agent memory usage
router.get('/agent/:agentId/usage', async (req, res) => {
    try {
        const usage = await db.getAgentMemoryUsage(req.params.agentId);
        res.json({
            success: true,
            usage: usage
        });
    } catch (error) {
        console.error('Error fetching agent memory usage:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch agent memory usage',
            details: error.message
        });
    }
});

// Export memories
router.get('/export/json', async (req, res) => {
    try {
        const { start_date, end_date, agent_id } = req.query;
        const memories = await db.exportMemories({ start_date, end_date, agent_id });
        
        res.json({
            success: true,
            count: memories.length,
            export_date: new Date().toISOString(),
            memories: memories
        });
    } catch (error) {
        console.error('Error exporting memories:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to export memories',
            details: error.message
        });
    }
});

module.exports = router;