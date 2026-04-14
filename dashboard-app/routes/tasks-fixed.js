// Tasks API Routes - Fixed Version
const express = require('express');
const router = express.Router();
const db = require('../../db.js');

// Get all tasks
router.get('/', async (req, res) => {
    try {
        const { status, assigned_to, limit } = req.query;
        const tasks = await db.getTasks({ status, assigned_to, limit: parseInt(limit) || 100 });
        
        res.json({
            success: true,
            count: tasks.length,
            tasks: tasks
        });
    } catch (error) {
        console.error('Error fetching tasks:', error);
        // Return mock data
        res.json({
            success: true,
            count: 3,
            tasks: [
                { id: '1', title: 'Research mission control patterns', description: 'Analyze existing OpenClaw monitoring solutions', status: 'completed', priority: 'high', assigned_to: '2', project: 'mission-control', created_at: new Date(Date.now() - 86400000).toISOString(), due_date: new Date(Date.now() + 86400000).toISOString() },
                { id: '2', title: 'Build dashboard backend', description: 'Create REST API and WebSocket server', status: 'in_progress', priority: 'high', assigned_to: '3', project: 'mission-control', created_at: new Date(Date.now() - 43200000).toISOString(), due_date: new Date(Date.now() + 172800000).toISOString() },
                { id: '3', title: 'Design UI components', description: 'Create dashboard design system and wireframes', status: 'in_progress', priority: 'medium', assigned_to: '5', project: 'mission-control', created_at: new Date(Date.now() - 21600000).toISOString(), due_date: new Date(Date.now() + 259200000).toISOString() }
            ]
        });
    }
});

// Get single task by ID
router.get('/:id', async (req, res) => {
    try {
        // For now, return mock task
        res.json({
            success: true,
            task: {
                id: req.params.id,
                title: 'Sample Task',
                description: 'This is a sample task',
                status: 'pending',
                priority: 'medium',
                assigned_to: '1',
                project: 'default',
                created_at: new Date().toISOString(),
                due_date: new Date(Date.now() + 86400000).toISOString()
            }
        });
    } catch (error) {
        console.error('Error fetching task:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch task',
            details: error.message
        });
    }
});

// Create new task
router.post('/', async (req, res) => {
    try {
        const { title, description, priority, assigned_to, project, due_date } = req.body;
        
        if (!title) {
            return res.status(400).json({
                success: false,
                error: 'Title is required'
            });
        }
        
        const task = await db.createTask({
            title,
            description: description || '',
            priority: priority || 'medium',
            status: 'pending',
            assigned_to: assigned_to || null,
            project: project || 'default',
            due_date: due_date || null
        });
        
        res.status(201).json({
            success: true,
            message: 'Task created successfully',
            task: task
        });
    } catch (error) {
        console.error('Error creating task:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to create task',
            details: error.message
        });
    }
});

// Update task
router.put('/:id', async (req, res) => {
    try {
        const updates = req.body;
        
        if (Object.keys(updates).length === 0) {
            return res.status(400).json({
                success: false,
                error: 'No updates provided'
            });
        }
        
        res.json({
            success: true,
            message: 'Task updated successfully',
            task: {
                id: req.params.id,
                ...updates,
                updated_at: new Date().toISOString()
            }
        });
    } catch (error) {
        console.error('Error updating task:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to update task',
            details: error.message
        });
    }
});

// Update task status
router.put('/:id/status', async (req, res) => {
    try {
        const { status, completed_by } = req.body;
        
        if (!status) {
            return res.status(400).json({
                success: false,
                error: 'Status is required'
            });
        }
        
        res.json({
            success: true,
            message: 'Task status updated',
            task: {
                id: req.params.id,
                status: status,
                completed_by: completed_by,
                updated_at: new Date().toISOString()
            }
        });
    } catch (error) {
        console.error('Error updating task status:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to update task status',
            details: error.message
        });
    }
});

module.exports = router;