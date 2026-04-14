#!/usr/bin/env node

/**
 * Memory Service for Mission Control Dashboard
 * 
 * Database-enabled service for memory system operations
 * 
 * Author: Brains (CMO)
 * Date: 2026-04-10
 */

const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const { EventEmitter } = require('events');

class MemoryService {
  constructor(dbPath = null) {
    this.dbPath = dbPath || path.join(__dirname, 'mission_control.db');
    this.db = null;
    this.eventEmitter = new EventEmitter();
    this.isConnected = false;
    
    console.log(`Memory Service initialized with database: ${this.dbPath}`);
  }
  
  /**
   * Connect to database
   */
  async connect() {
    return new Promise((resolve, reject) => {
      if (this.isConnected && this.db) {
        resolve(this.db);
        return;
      }
      
      this.db = new sqlite3.Database(this.dbPath, sqlite3.OPEN_READWRITE, (err) => {
        if (err) {
          console.error('Error connecting to database:', err.message);
          reject(err);
          return;
        }
        
        // Enable foreign keys
        this.db.run('PRAGMA foreign_keys = ON', (err) => {
          if (err) {
            console.warn('Warning: Could not enable foreign keys:', err.message);
          }
        });
        
        this.isConnected = true;
        console.log('Connected to memory database');
        resolve(this.db);
      });
    });
  }
  
  /**
   * Disconnect from database
   */
  async disconnect() {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        resolve();
        return;
      }
      
      this.db.close((err) => {
        if (err) {
          console.error('Error closing database:', err.message);
          reject(err);
          return;
        }
        
        this.db = null;
        this.isConnected = false;
        console.log('Disconnected from memory database');
        resolve();
      });
    });
  }
  
  /**
   * Log agent activity
   */
  async logActivity(activity) {
    await this.connect();
    
    return new Promise((resolve, reject) => {
      const {
        agent_id,
        agent_name,
        activity_type,
        activity_data,
        priority = 0,
        session_id = null
      } = activity;
      
      // First, get agent ID from name if not provided
      let agentId = agent_id;
      if (!agentId && agent_name) {
        agentId = await this.getAgentIdByName(agent_name);
      }
      
      if (!agentId) {
        reject(new Error('Agent ID or name is required'));
        return;
      }
      
      const description = activity_data?.message || activity_data?.description || 'Activity logged';
      const metadata = JSON.stringify(activity_data || {});
      
      const sql = `
        INSERT INTO agent_activities 
        (agent_id, activity_type, description, metadata, timestamp)
        VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
      `;
      
      this.db.run(sql, [agentId, activity_type, description, metadata], function(err) {
        if (err) {
          reject(err);
          return;
        }
        
        const activityId = this.lastID;
        
        // Also log to task_executions if it's a task activity
        if (activity_type.includes('task')) {
          this.logTaskExecution({
            task_id: `activity-${activityId}`,
            task_name: description,
            agent_id: agentId,
            status: activity_type === 'task_complete' ? 'completed' : 'running',
            result_data: metadata,
            priority: priority
          }).catch(console.error); // Don't fail main log if task log fails
        }
        
        // Emit event
        this.eventEmitter.emit('activity_logged', {
          id: activityId,
          agent_id: agentId,
          activity_type,
          timestamp: new Date().toISOString()
        });
        
        resolve(activityId);
      }.bind(this));
    });
  }
  
  /**
   * Log task execution
   */
  async logTaskExecution(task) {
    await this.connect();
    
    return new Promise((resolve, reject) => {
      const {
        task_id,
        task_name,
        agent_id,
        agent_name,
        session_id = null,
        status = 'running',
        result_data = null,
        error_message = null,
        duration_ms = null,
        memory_peak = null,
        priority = 0,
        tags = null
      } = task;
      
      // Get agent ID from name if not provided
      let agentId = agent_id;
      if (!agentId && agent_name) {
        agentId = this.getAgentIdByName(agent_name);
      }
      
      if (!agentId) {
        reject(new Error('Agent ID or name is required'));
        return;
      }
      
      const resultDataJson = result_data ? JSON.stringify(result_data) : null;
      const tagsJson = tags ? JSON.stringify(tags) : null;
      
      const sql = `
        INSERT INTO task_executions 
        (task_id, task_name, agent_id, session_id, status, 
         result_data, error_message, duration_ms, memory_peak, priority, tags)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      
      this.db.run(sql, [
        task_id, task_name, agentId, session_id, status,
        resultDataJson, error_message, duration_ms, memory_peak, priority, tagsJson
      ], function(err) {
        if (err) {
          reject(err);
          return;
        }
        
        const taskId = this.lastID;
        
        // Emit event
        this.eventEmitter.emit('task_logged', {
          id: taskId,
          task_id,
          agent_id: agentId,
          status,
          timestamp: new Date().toISOString()
        });
        
        resolve(taskId);
      }.bind(this));
    });
  }
  
  /**
   * Start agent session
   */
  async startAgentSession(sessionData) {
    await this.connect();
    
    return new Promise((resolve, reject) => {
      const {
        agent_id,
        agent_name,
        session_uuid,
        metadata = {},
        memory_usage_start = null
      } = sessionData;
      
      // Get agent ID from name if not provided
      let agentId = agent_id;
      if (!agentId && agent_name) {
        agentId = this.getAgentIdByName(agent_name);
      }
      
      if (!agentId) {
        reject(new Error('Agent ID or name is required'));
        return;
      }
      
      const sessionUuid = session_uuid || `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const metadataJson = JSON.stringify(metadata);
      
      const sql = `
        INSERT INTO agent_sessions 
        (agent_id, session_uuid, status, metadata, memory_usage_start)
        VALUES (?, ?, 'active', ?, ?)
      `;
      
      this.db.run(sql, [agentId, sessionUuid, metadataJson, memory_usage_start], function(err) {
        if (err) {
          reject(err);
          return;
        }
        
        const sessionId = this.lastID;
        
        // Update agent status
        this.db.run(
          'UPDATE agents SET status = "active", last_seen = CURRENT_TIMESTAMP WHERE id = ?',
          [agentId],
          (err) => {
            if (err) {
              console.warn('Could not update agent status:', err.message);
            }
          }
        );
        
        // Emit event
        this.eventEmitter.emit('session_started', {
          id: sessionId,
          agent_id: agentId,
          session_uuid: sessionUuid,
          timestamp: new Date().toISOString()
        });
        
        resolve({ sessionId, sessionUuid });
      }.bind(this));
    });
  }
  
  /**
   * End agent session
   */
  async endAgentSession(sessionId, sessionData = {}) {
    await this.connect();
    
    return new Promise((resolve, reject) => {
      const {
        status = 'completed',
        memory_usage_end = null,
        error_count = 0
      } = sessionData;
      
      const sql = `
        UPDATE agent_sessions 
        SET end_time = CURRENT_TIMESTAMP, 
            status = ?,
            memory_usage_end = ?,
            error_count = ?,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `;
      
      this.db.run(sql, [status, memory_usage_end, error_count, sessionId], function(err) {
        if (err) {
          reject(err);
          return;
        }
        
        // Get agent ID for status update
        this.db.get('SELECT agent_id FROM agent_sessions WHERE id = ?', [sessionId], (err, row) => {
          if (!err && row) {
            // Only update agent status if no other active sessions
            this.db.get(
              'SELECT COUNT(*) as active_count FROM agent_sessions WHERE agent_id = ? AND status = "active"',
              [row.agent_id],
              (err, countRow) => {
                if (!err && countRow.active_count === 0) {
                  this.db.run(
                    'UPDATE agents SET status = "inactive" WHERE id = ?',
                    [row.agent_id],
                    (err) => {
                      if (err) {
                        console.warn('Could not update agent status:', err.message);
                      }
                    }
                  );
                }
              }
            );
          }
        });
        
        // Emit event
        this.eventEmitter.emit('session_ended', {
          sessionId,
          status,
          timestamp: new Date().toISOString()
        });
        
        resolve(this.changes > 0);
      }.bind(this));
    });
  }
  
  /**
   * Record memory usage
   */
  async recordMemoryUsage(usageData) {
    await this.connect();
    
    return new Promise((resolve, reject) => {
      const {
        agent_id,
        agent_name,
        session_id = null,
        memory_current,
        memory_peak,
        memory_limit = null,
        process_count = 1,
        collection_interval = 30000,
        metadata = {}
      } = usageData;
      
      // Get agent ID from name if not provided
      let agentId = agent_id;
      if (!agentId && agent_name) {
        agentId = this.getAgentIdByName(agent_name);
      }
      
      if (!agentId) {
        reject(new Error('Agent ID or name is required'));
        return;
      }
      
      if (memory_current === undefined) {
        reject(new Error('memory_current is required'));
        return;
      }
      
      const metadataJson = JSON.stringify(metadata);
      const memoryPeak = memory_peak || memory_current;
      
      const sql = `
        INSERT INTO memory_usage_series 
        (agent_id, session_id, memory_current, memory_peak, 
         memory_limit, process_count, collection_interval, metadata)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `;
      
      this.db.run(sql, [
        agentId, session_id, memory_current, memoryPeak,
        memory_limit, process_count, collection_interval, metadataJson
      ], function(err) {
        if (err) {
          reject(err);
          return;
        }
        
        const usageId = this.lastID;
        
        // Emit event
        this.eventEmitter.emit('memory_recorded', {
          id: usageId,
          agent_id: agentId,
          memory_current,
          memory_peak: memoryPeak,
          timestamp: new Date().toISOString()
        });
        
        resolve(usageId);
      }.bind(this));
    });
  }
  
  /**
   * Search activities
   */
  async searchActivities(query, filters = {}) {
    await this.connect();
    
    return new Promise((resolve, reject) => {
      const {
        agent_id = null,
        activity_type = null,
        date_from = null,
        date_to = null,
        limit = 50,
        offset = 0
      } = filters;
      
      let whereClauses = [];
      let params = [];
      
      if (query) {
        whereClauses.push('(description LIKE ? OR metadata LIKE ?)');
        params.push(`%${query}%`, `%${query}%`);
      }
      
      if (agent_id) {
        whereClauses.push('agent_id = ?');
        params.push(agent_id);
      }
      
      if (activity_type) {
        whereClauses.push('activity_type = ?');
        params.push(activity_type);
      }
      
      if (date_from) {
        whereClauses.push('timestamp >= ?');
        params.push(date_from);
      }
      
      if (date_to) {
        whereClauses.push('timestamp <= ?');
        params.push(date_to);
      }
      
      const whereClause = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';
      
      // Get total count
      const countSql = `SELECT COUNT(*) as total FROM agent_activities ${whereClause}`;
      
      this.db.get(countSql, params, (err, countRow) => {
        if (err) {
          reject(err);
          return;
        }
        
        // Get activities
        const activitiesSql = `
          SELECT aa.*, a.name as agent_name, a.role as agent_role
          FROM agent_activities aa
          JOIN agents a ON aa.agent_id = a.id
          ${whereClause}
          ORDER BY aa.timestamp DESC
          LIMIT ? OFFSET ?
        `;
        
        const activitiesParams = [...params, limit, offset];
        
        this.db.all(activitiesSql, activitiesParams, (err, rows) => {
          if (err) {
            reject(err);
            return;
          }
          
          // Parse JSON metadata
          const activities = rows.map(row => ({
            ...row,
            metadata: row.metadata ? JSON.parse(row.metadata) : {}
          }));
          
          resolve({
            activities,
            total: countRow.total,
            page: Math.floor(offset / limit) + 1,
            pages: Math.ceil(countRow.total / limit),
            limit,
            offset
          });
        });
      });
    });
  }
  
  /**
   * Get agent metrics
   */
  async getAgentMetrics(agentId, timeRange = '24h') {
    await this.connect();
    
    return new Promise((resolve, reject) => {
      // Calculate time range
      let timeCondition = '';
      switch (timeRange) {
        case '1h':
          timeCondition = "timestamp >= datetime('now', '-1 hour')";
          break;
        case '24h':
          timeCondition = "timestamp >= datetime('now', '-1 day')";
          break;
        case '7d':
          timeCondition = "timestamp >= datetime('now', '-7 days')";
          break;
        case '30d':
          timeCondition = "timestamp >= datetime('now', '-30 days')";
          break;
        default:
          timeCondition = "timestamp >= datetime('now', '-1 day')";
      }
      
      const agentCondition = agentId ? `AND agent_id = ${agentId}` : '';
      
      // Get activity metrics
      const activitySql = `
        SELECT 
          COUNT(*) as total_activities,
          SUM(CASE WHEN activity_type = 'task_complete' THEN 1 ELSE 0 END) as tasks_completed,
          SUM(CASE WHEN activity_type = 'error' THEN 1 ELSE 0 END) as errors,
          MIN(timestamp) as first_activity,
          MAX(timestamp) as last_activity
        FROM agent_activities
        WHERE ${timeCondition} ${agentCondition}
      `;
      
      // Get memory metrics
      const memorySql = `
        SELECT 
          AVG(memory_current) as avg_memory,
          MAX(memory_peak) as peak_memory,
          COUNT(*) as samples
        FROM memory_usage_series
        WHERE ${timeCondition} ${agentCondition}
      `;
      
      // Get task metrics
      const taskSql = `
        SELECT 
          COUNT(*) as total_tasks,
          AVG(duration_ms) as avg_duration,
          SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as tasks_completed,
          SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) as tasks_failed
        FROM task_executions
        WHERE start_time >= datetime('now', '-1 day') ${agentId ? `AND agent_id = ${agentId}` : ''}
      `;
      
      this.db.get(activitySql, (err, activityMetrics) => {
        if (err) {
          reject(err);
          return;
        }
        
        this.db.get(memorySql, (err, memoryMetrics) => {
          if (err) {
            reject(err);
            return;
          }
          
          this.db.get(taskSql, (err, taskMetrics) => {
            if (err) {
              reject(err);
              return;
            }
            
            // Calculate derived metrics
            const errorRate = activityMetrics.total_activities > 0 
              ? activityMetrics.errors / activityMetrics.total_activities 
              : 0;
            
            const completionRate = taskMetrics.total_tasks > 0
              ? taskMetrics.tasks_completed / taskMetrics.total_tasks
              : 0;
            
            resolve({
              time_range: timeRange,
              activity: activityMetrics,
              memory: memoryMetrics,
              tasks: taskMetrics,
              derived_metrics: {
                error_rate: errorRate,
                task_completion_rate: completionRate,
                memory_efficiency: memoryMetrics.avg_memory > 0 
                  ? (memoryMetrics.avg_memory / (memoryMetrics.peak_memory || 1)) 
                  : 0
              }
            });
          });
        });
      });
    });
  }
  
  /**
   * Get agent ID by name
   */
  async getAgentIdByName(agentName) {
    await this.connect();
    
    return new Promise((resolve, reject) => {
      this.db.get('SELECT id FROM agents WHERE name = ?', [agentName], (err, row) => {
        if (err) {
          reject(err);
          return;
        }
        
        resolve(row ? row.id : null);
      });
    });
  }
  
  /**
   * Get service status
   */
  async getStatus() {
    await this.connect();
    
    return new Promise((resolve, reject