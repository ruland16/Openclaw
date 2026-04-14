#!/usr/bin/env node

/**
 * Log Collector Service for Mission Control Dashboard
 * 
 * This service collects agent activities and stores them in memory
 * while waiting for the database to be set up by Elon.
 * 
 * Author: Brains (CMO)
 * Date: 2026-04-10
 */

const fs = require('fs');
const path = require('path');
const { EventEmitter } = require('events');

class LogCollector {
  constructor(options = {}) {
    this.options = {
      bufferSize: 1000,
      flushInterval: 30000, // 30 seconds
      logDirectory: path.join(__dirname, 'memory-logs'),
      ...options
    };
    
    this.buffer = [];
    this.eventEmitter = new EventEmitter();
    this.isCollecting = false;
    
    // Ensure log directory exists
    if (!fs.existsSync(this.options.logDirectory)) {
      fs.mkdirSync(this.options.logDirectory, { recursive: true });
    }
    
    // Set up event listeners
    this.setupEventListeners();
  }
  
  setupEventListeners() {
    // Listen for process events
    process.on('SIGINT', () => this.shutdown());
    process.on('SIGTERM', () => this.shutdown());
    
    // Flush buffer at regular intervals
    setInterval(() => this.flushBuffer(), this.options.flushInterval);
  }
  
  /**
   * Start collecting logs
   */
  start() {
    if (this.isCollecting) {
      console.warn('Log collector is already running');
      return;
    }
    
    this.isCollecting = true;
    console.log(`Log collector started at ${new Date().toISOString()}`);
    console.log(`Buffer size: ${this.options.bufferSize}`);
    console.log(`Flush interval: ${this.options.flushInterval}ms`);
    console.log(`Log directory: ${this.options.logDirectory}`);
    
    // Simulate some initial agent activities for testing
    this.simulateInitialActivities();
    
    return this;
  }
  
  /**
   * Log an agent activity
   */
  logActivity(activity) {
    if (!this.isCollecting) {
      console.warn('Log collector is not running. Activity not logged:', activity);
      return false;
    }
    
    const activityWithMetadata = {
      id: this.generateId(),
      timestamp: new Date().toISOString(),
      collected_at: new Date().toISOString(),
      ...activity
    };
    
    this.buffer.push(activityWithMetadata);
    
    // Emit event for real-time processing
    this.eventEmitter.emit('activity', activityWithMetadata);
    
    // Check if buffer needs flushing
    if (this.buffer.length >= this.options.bufferSize) {
      this.flushBuffer();
    }
    
    return activityWithMetadata.id;
  }
  
  /**
   * Generate a unique ID for activities
   */
  generateId() {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
  
  /**
   * Flush buffer to disk
   */
  flushBuffer() {
    if (this.buffer.length === 0) {
      return;
    }
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `activities-${timestamp}.json`;
    const filepath = path.join(this.options.logDirectory, filename);
    
    try {
      const data = {
        flush_timestamp: new Date().toISOString(),
        count: this.buffer.length,
        activities: [...this.buffer]
      };
      
      fs.writeFileSync(filepath, JSON.stringify(data, null, 2));
      console.log(`Flushed ${this.buffer.length} activities to ${filename}`);
      
      // Clear buffer
      this.buffer.length = 0;
      
      // Emit flush event
      this.eventEmitter.emit('flush', { filename, count: data.count });
      
    } catch (error) {
      console.error('Error flushing buffer:', error.message);
    }
  }
  
  /**
   * Get current buffer stats
   */
  getStats() {
    return {
      isCollecting: this.isCollecting,
      bufferSize: this.buffer.length,
      maxBufferSize: this.options.bufferSize,
      flushInterval: this.options.flushInterval,
      logDirectory: this.options.logDirectory,
      filesInDirectory: this.getLogFileCount()
    };
  }
  
  /**
   * Count log files in directory
   */
  getLogFileCount() {
    try {
      const files = fs.readdirSync(this.options.logDirectory);
      return files.filter(file => file.endsWith('.json')).length;
    } catch (error) {
      return 0;
    }
  }
  
  /**
   * Search activities in memory buffer
   */
  searchInBuffer(query, filters = {}) {
    return this.buffer.filter(activity => {
      // Simple text search across all string fields
      const activityText = JSON.stringify(activity).toLowerCase();
      const queryText = query.toLowerCase();
      
      if (query && !activityText.includes(queryText)) {
        return false;
      }
      
      // Apply filters
      if (filters.agent_id && activity.agent_id !== filters.agent_id) {
        return false;
      }
      
      if (filters.activity_type && activity.activity_type !== filters.activity_type) {
        return false;
      }
      
      if (filters.date_from) {
        const activityDate = new Date(activity.timestamp);
        const fromDate = new Date(filters.date_from);
        if (activityDate < fromDate) return false;
      }
      
      if (filters.date_to) {
        const activityDate = new Date(activity.timestamp);
        const toDate = new Date(filters.date_to);
        if (activityDate > toDate) return false;
      }
      
      return true;
    });
  }
  
  /**
   * Simulate initial agent activities for testing
   */
  simulateInitialActivities() {
    const agents = [
      { id: 'lui', name: 'Lui', role: 'COO' },
      { id: 'elon', name: 'Elon', role: 'CTO' },
      { id: 'warren', name: 'Warren', role: 'Strategy Chief' },
      { id: 'brains', name: 'Brains', role: 'CMO' },
      { id: 'lens', name: 'Lens', role: 'Media Producer' },
      { id: 'buzz', name: 'Buzz', role: 'CCO' },
      { id: 'goldie', name: 'Goldie', role: 'Marketing Chief' },
      { id: 'june', name: 'June', role: 'Life Manager' }
    ];
    
    const activityTypes = [
      'task_start',
      'task_complete', 
      'status_update',
      'error',
      'warning',
      'info'
    ];
    
    // Log initial startup activities
    agents.forEach(agent => {
      this.logActivity({
        agent_id: agent.id,
        agent_name: agent.name,
        activity_type: 'status_update',
        activity_data: {
          message: `${agent.name} (${agent.role}) initialized for Mission Control Dashboard project`,
          status: 'active',
          role: agent.role
        },
        priority: 1
      });
    });
    
    // Log specific project activities
    this.logActivity({
      agent_id: 'lui',
      agent_name: 'Lui',
      activity_type: 'task_start',
      activity_data: {
        task_name: 'Project Coordination',
        task_id: 'mission-control-001',
        description: 'Coordinate Mission Control Dashboard project team'
      },
      priority: 3
    });
    
    this.logActivity({
      agent_id: 'elon',
      agent_name: 'Elon',
      activity_type: 'task_start',
      activity_data: {
        task_name: 'Database Design',
        task_id: 'mission-control-002',
        description: 'Design database schema for mission control dashboard'
      },
      priority: 3
    });
    
    this.logActivity({
      agent_id: 'brains',
      agent_name: 'Brains',
      activity_type: 'task_start',
      activity_data: {
        task_name: 'Memory System Design',
        task_id: 'mission-control-003',
        description: 'Design memory integration system for dashboard'
      },
      priority: 3
    });
    
    console.log('Simulated initial agent activities logged');
  }
  
  /**
   * Graceful shutdown
   */
  shutdown() {
    console.log('Shutting down log collector...');
    
    // Flush any remaining activities
    if (this.buffer.length > 0) {
      console.log(`Flushing ${this.buffer.length} remaining activities...`);
      this.flushBuffer();
    }
    
    this.isCollecting = false;
    console.log('Log collector stopped');
    
    if (process.env.NODE_ENV !== 'test') {
      process.exit(0);
    }
  }
}

// Export for module usage
module.exports = LogCollector;

// If run directly, start the collector
if (require.main === module) {
  const collector = new LogCollector();
  collector.start();
  
  // Example: Log a test activity every 10 seconds
  setInterval(() => {
    const agents = ['lui', 'elon', 'warren', 'brains'];
    const agent = agents[Math.floor(Math.random() * agents.length)];
    
    collector.logActivity({
      agent_id: agent,
      agent_name: agent.charAt(0).toUpperCase() + agent.slice(1),
      activity_type: 'status_update',
      activity_data: {
        message: `Heartbeat check - ${agent} is active`,
        memory_usage: Math.floor(Math.random() * 100000000) + 50000000 // 50-150MB
      },
      priority: 0
    });
  }, 10000);
  
  // Display stats every minute
  setInterval(() => {
    const stats = collector.getStats();
    console.log('\n=== Log Collector Stats ===');
    console.log(`Buffer: ${stats.bufferSize}/${stats.maxBufferSize}`);
    console.log(`Log files: ${stats.filesInDirectory}`);
    console.log(`Status: ${stats.isCollecting ? 'Active' : 'Inactive'}`);
    console.log('===========================\n');
  }, 60000);
}