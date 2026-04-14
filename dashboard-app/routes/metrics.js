// Metrics API Routes
const express = require('express');
const router = express.Router();
const db = require('../../db.js');

// Get system metrics
router.get('/', async (req, res) => {
    try {
        const period = req.query.period || 'day'; // day, week, month
        const metrics = await db.getSystemMetrics(period);
        
        res.json({
            success: true,
            period: period,
            metrics: metrics
        });
    } catch (error) {
        console.error('Error fetching system metrics:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch system metrics',
            details: error.message
        });
    }
});

// Get agent performance metrics
router.get('/agents', async (req, res) => {
    try {
        const metrics = await db.getAgentPerformanceMetrics();
        res.json({
            success: true,
            count: metrics.length,
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

// Get task completion metrics
router.get('/tasks', async (req, res) => {
    try {
        const { period, project } = req.query;
        const metrics = await db.getTaskCompletionMetrics(period, project);
        
        res.json({
            success: true,
            period: period || 'all',
            project: project || 'all',
            metrics: metrics
        });
    } catch (error) {
        console.error('Error fetching task metrics:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch task metrics',
            details: error.message
        });
    }
});

// Get activity volume metrics
router.get('/activities', async (req, res) => {
    try {
        const { period, agent_id } = req.query;
        const metrics = await db.getActivityVolumeMetrics(period, agent_id);
        
        res.json({
            success: true,
            period: period || 'day',
            agent_id: agent_id || 'all',
            metrics: metrics
        });
    } catch (error) {
        console.error('Error fetching activity metrics:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch activity metrics',
            details: error.message
        });
    }
});

// Get response time metrics
router.get('/response-times', async (req, res) => {
    try {
        const { period, agent_id } = req.query;
        const metrics = await db.getResponseTimeMetrics(period, agent_id);
        
        res.json({
            success: true,
            period: period || 'day',
            agent_id: agent_id || 'all',
            metrics: metrics
        });
    } catch (error) {
        console.error('Error fetching response time metrics:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch response time metrics',
            details: error.message
        });
    }
});

// Get system health metrics
router.get('/health', async (req, res) => {
    try {
        const health = await db.getSystemHealthMetrics();
        res.json({
            success: true,
            health: health,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Error fetching health metrics:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch health metrics',
            details: error.message
        });
    }
});

// Record new metric
router.post('/', async (req, res) => {
    try {
        const { metric_type, value, agent_id, details } = req.body;
        
        if (!metric_type || value === undefined) {
            return res.status(400).json({
                success: false,
                error: 'Metric type and value are required'
            });
        }
        
        const metric = await db.recordMetric(metric_type, value, agent_id, details);
        
        res.status(201).json({
            success: true,
            message: 'Metric recorded successfully',
            metric: metric
        });
    } catch (error) {
        console.error('Error recording metric:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to record metric',
            details: error.message
        });
    }
});

// Get metric trends
router.get('/trends/:metricType', async (req, res) => {
    try {
        const { period, aggregation } = req.query;
        const trends = await db.getMetricTrends(req.params.metricType, period, aggregation);
        
        res.json({
            success: true,
            metric_type: req.params.metricType,
            period: period || 'week',
            aggregation: aggregation || 'hour',
            trends: trends
        });
    } catch (error) {
        console.error('Error fetching metric trends:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch metric trends',
            details: error.message
        });
    }
});

// Get dashboard summary metrics
router.get('/dashboard', async (req, res) => {
    try {
        const summary = await db.getDashboardSummary();
        res.json({
            success: true,
            summary: summary,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Error fetching dashboard summary:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch dashboard summary',
            details: error.message
        });
    }
});

module.exports = router;