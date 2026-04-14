// Tasks API Routes
const express = require('express');
const router = express.Router();
const db = require('../../db.js');

// Get all tasks
router.get('/', async (req, res) => {
    try {
        const { status, assigned_to, limit } = req.query;
        const tasks = await db.getAllTasks({ status, assigned_to, limit: parseInt(limit) || 100 });
        
        res.json({
            success: true,
            count: tasks.length,
            tasks: tasks
        });
    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch tasks',
            details: error.message
        });
    }
});

// Get single task by ID
router.get('/:id', async (req, res) => {
    try {
        const task = await db.getTaskById(req.params.id);
        if (task) {
            res.json({
                success: true,
                task: task
            });
        } else {
            res.status(404).json({
                success: false,
                error: 'Task not found'
            });
        }
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
        
        // Log task creation
        if (assigned_to) {
            await db.logActivity(
                assigned_to,
                'task_created',
                { taskId: task.id, title: task.title, priority: task.priority }
            );
        } else {
            await db.logActivity(
                'system',
                'task_created',
                { taskId: task.id, title: task.title, priority: task.priority }
            );
        }
        
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
        
        const updated = await db.updateTask(req.params.id, updates);
        
        // Log task update
        await db.logActivity(
            updates.assigned_to || 'system',
            'task_updated',
            { taskId: req.params.id, updates: updates }
        );
        
        res.json({
            success: true,
            message: 'Task updated successfully',
            task: updated
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

// Delete task
router.delete('/:id', async (req, res) => {
    try {
        const deleted = await db.deleteTask(req.params.id);
        
        if (deleted) {
            // Log task deletion
            await db.logActivity(
                'system',
                'task_deleted',
                { taskId: req.params.id }
            );
            
            res.json({
                success: true,
                message: 'Task deleted successfully'
            });
        } else {
            res.status(404).json({
                success: false,
                error: 'Task not found'
            });
        }
    } catch (error) {
        console.error('Error deleting task:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to delete task',
            details: error.message
        });
    }
});

// Get task activities
router.get('/:id/activities', async (req, res) => {
    try {
        const activities = await db.getTaskActivities(req.params.id);
        res.json({
            success: true,
            count: activities.length,
            activities: activities
        });
    } catch (error) {
        console.error('Error fetching task activities:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch task activities',
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
        
        const updated = await db.updateTaskStatus(req.params.id, status, completed_by);
        
        // Log status change
        await db.logActivity(
            completed_by || 'system',
            'task_status_changed',
            { taskId: req.params.id, from: updated.previousStatus, to: status }
        );
        
        res.json({
            success: true,
            message: 'Task status updated',
            task: updated
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

// Assign task to agent
router.post('/:id/assign', async (req, res) => {
    try {
        const { agent_id } = req.body;
        
        if (!agent_id) {
            return res.status(400).json({
                success: false,
                error: 'Agent ID is required'
            });
        }
        
        const updated = await db.assignTask(req.params.id, agent_id);
        
        // Log assignment
        await db.logActivity(
            agent_id,
            'task_assigned',
            { taskId: req.params.id, title: updated.title }
        );
        
        res.json({
            success: true,
            message: 'Task assigned successfully',
            task: updated
        });
    } catch (error) {
        console.error('Error assigning task:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to assign task',
            details: error.message
        });
    }
});

// Get tasks by agent
router.get('/agent/:agentId', async (req, res) => {
    try {
        const tasks = await db.getTasksByAgent(req.params.agentId);
        res.json({
            success: true,
            count: tasks.length,
            tasks: tasks
        });
    } catch (error) {
        console.error('Error fetching agent tasks:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch agent tasks',
            details: error.message
        });
    }
});

module.exports = router;