# MEMORY INTEGRATION SYSTEM DESIGN
## Mission Control Dashboard - Memory System Architecture

**Author:** Brains (CMO)
**Date:** 2026-04-10
**Status:** DESIGN PHASE

---

## **OVERVIEW**
Memory system for the OpenClaw Mission Control Dashboard that provides:
1. Real-time agent activity logging
2. Historical data storage and retrieval
3. Memory search capabilities
4. Data aggregation for metrics
5. Memory usage tracking

---

## **ARCHITECTURE DESIGN**

### **1. DATA FLOW**
```
Agent Activities → Log Collector → Memory Database → Search Index → Dashboard API
      ↑                ↑               ↑               ↑               ↑
  Real-time        Buffering       Persistence     Query Engine    Visualization
```

### **2. COMPONENTS**

#### **A. Log Collector Service**
- **Purpose:** Capture agent activities in real-time
- **Input Sources:**
  - Agent session logs
  - Task completion events
  - Status updates
  - Error reports
- **Features:**
  - Buffering for high-volume events
  - Deduplication
  - Priority queuing
  - Rate limiting

#### **B. Memory Database Schema**
- **Primary Tables:**
  1. `agent_activities` - Raw activity logs
  2. `agent_sessions` - Session metadata
  3. `task_executions` - Task completion records
  4. `memory_usage` - Memory consumption tracking
  5. `search_index` - Optimized search data

#### **C. Search & Retrieval API**
- **Endpoints:**
  - `/api/memory/search` - Full-text search
  - `/api/memory/activities` - Filtered activity query
  - `/api/memory/metrics` - Aggregated metrics
  - `/api/memory/usage` - Memory usage reports

#### **D. Data Aggregation Engine**
- **Aggregation Levels:**
  - Real-time (last 5 minutes)
  - Hourly
  - Daily
  - Weekly
- **Metrics Calculated:**
  - Agent productivity scores
  - Task completion rates
  - Error frequency
  - Memory efficiency

---

## **DATABASE SCHEMA DESIGN**

### **Table: agent_activities**
```sql
CREATE TABLE agent_activities (
    id UUID PRIMARY KEY,
    agent_id VARCHAR(50) NOT NULL,
    agent_name VARCHAR(50) NOT NULL,
    activity_type VARCHAR(50) NOT NULL,  -- 'task_start', 'task_complete', 'error', 'status_update'
    activity_data JSONB NOT NULL,        -- Structured activity details
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    session_id UUID REFERENCES agent_sessions(id),
    priority INTEGER DEFAULT 0,
    processed BOOLEAN DEFAULT FALSE
);

-- Indexes
CREATE INDEX idx_agent_activities_agent ON agent_activities(agent_id, timestamp);
CREATE INDEX idx_agent_activities_type ON agent_activities(activity_type, timestamp);
CREATE INDEX idx_agent_activities_processed ON agent_activities(processed) WHERE NOT processed;
```

### **Table: agent_sessions**
```sql
CREATE TABLE agent_sessions (
    id UUID PRIMARY KEY,
    agent_id VARCHAR(50) NOT NULL,
    agent_name VARCHAR(50) NOT NULL,
    start_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    end_time TIMESTAMP WITH TIME ZONE,
    status VARCHAR(20) DEFAULT 'active',  -- 'active', 'completed', 'error'
    metadata JSONB,                       -- Session configuration, model, etc.
    memory_usage_start INTEGER,           -- Starting memory in bytes
    memory_usage_end INTEGER,             -- Ending memory in bytes
    task_count INTEGER DEFAULT 0
);

-- Indexes
CREATE INDEX idx_agent_sessions_active ON agent_sessions(status) WHERE status = 'active';
CREATE INDEX idx_agent_sessions_agent ON agent_sessions(agent_id, start_time);
```

### **Table: task_executions**
```sql
CREATE TABLE task_executions (
    id UUID PRIMARY KEY,
    task_id VARCHAR(100) NOT NULL,
    task_name VARCHAR(200) NOT NULL,
    agent_id VARCHAR(50) NOT NULL,
    start_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    end_time TIMESTAMP WITH TIME ZONE,
    status VARCHAR(20) DEFAULT 'running',  -- 'running', 'completed', 'failed', 'cancelled'
    result_data JSONB,                     -- Task results/output
    error_message TEXT,
    duration_ms INTEGER,                   -- Calculated duration
    memory_peak INTEGER,                   -- Peak memory usage during task
    session_id UUID REFERENCES agent_sessions(id)
);

-- Indexes
CREATE INDEX idx_task_executions_status ON task_executions(status);
CREATE INDEX idx_task_executions_agent ON task_executions(agent_id, start_time);
CREATE INDEX idx_task_executions_task ON task_executions(task_id);
```

### **Table: memory_usage**
```sql
CREATE TABLE memory_usage (
    id UUID PRIMARY KEY,
    agent_id VARCHAR(50) NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    memory_current INTEGER NOT NULL,      -- Current memory in bytes
    memory_peak INTEGER NOT NULL,         -- Peak memory since last reset
    memory_limit INTEGER,                 -- Configured memory limit if any
    process_count INTEGER,                -- Number of active processes
    collection_interval INTEGER DEFAULT 30000  -- Collection interval in ms
);

-- Indexes
CREATE INDEX idx_memory_usage_agent ON memory_usage(agent_id, timestamp);
CREATE INDEX idx_memory_usage_time ON memory_usage(timestamp);
```

### **Table: search_index**
```sql
CREATE TABLE search_index (
    id UUID PRIMARY KEY,
    source_table VARCHAR(50) NOT NULL,    -- 'agent_activities', 'task_executions'
    source_id UUID NOT NULL,              -- Foreign key to source table
    content TEXT NOT NULL,                -- Searchable text content
    metadata JSONB,                       -- Additional search metadata
    indexed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    search_vector TSVECTOR                -- Full-text search vector
);

-- Indexes
CREATE INDEX idx_search_index_vector ON search_index USING GIN(search_vector);
CREATE INDEX idx_search_index_source ON search_index(source_table, source_id);
```

---

## **API DESIGN**

### **1. Search API**
```javascript
// GET /api/memory/search
{
  "query": "string",           // Search query
  "filters": {
    "agent_id": ["string"],    // Filter by agent(s)
    "activity_type": ["string"], // Filter by activity type
    "date_from": "ISO8601",    // Start date
    "date_to": "ISO8601",      // End date
    "min_priority": 0          // Minimum priority
  },
  "limit": 50,
  "offset": 0,
  "sort_by": "timestamp",      // 'timestamp', 'priority', 'relevance'
  "sort_order": "desc"         // 'asc', 'desc'
}

// Response
{
  "results": [
    {
      "id": "uuid",
      "agent_id": "string",
      "agent_name": "string",
      "activity_type": "string",
      "content": "string",
      "timestamp": "ISO8601",
      "relevance_score": 0.95,
      "source": "agent_activities"
    }
  ],
  "total": 1000,
  "page": 1,
  "pages": 20
}
```

### **2. Activity Stream API**
```javascript
// GET /api/memory/activities/stream
// WebSocket endpoint for real-time activity stream
{
  "event": "activity",
  "data": {
    "id": "uuid",
    "agent_id": "string",
    "agent_name": "string",
    "activity_type": "string",
    "activity_data": {},
    "timestamp": "ISO8601"
  }
}
```

### **3. Metrics API**
```javascript
// GET /api/memory/metrics
{
  "time_range": "24h",  // '1h', '24h', '7d', '30d'
  "agents": ["all"],    // Specific agents or 'all'
  "metrics": [          // Requested metrics
    "task_completion_rate",
    "average_duration",
    "error_rate",
    "memory_efficiency"
  ]
}

// Response
{
  "time_range": {
    "start": "ISO8601",
    "end": "ISO8601"
  },
  "metrics": {
    "task_completion_rate": 0.95,
    "average_duration": 1250,  // ms
    "error_rate": 0.02,
    "memory_efficiency": 0.85
  },
  "by_agent": {
    "lui": { "task_completion_rate": 0.98, ... },
    "elon": { "task_completion_rate": 0.92, ... }
  }
}
```

### **4. Memory Usage API**
```javascript
// GET /api/memory/usage
{
  "agent_id": "string",  // Optional, all agents if omitted
  "time_range": "24h",   // '1h', '24h', '7d', '30d'
  "granularity": "5m"    // Data point granularity
}

// Response
{
  "agent_id": "string",
  "time_series": [
    {
      "timestamp": "ISO8601",
      "memory_current": 157286400,  // 150MB in bytes
      "memory_peak": 209715200,      // 200MB in bytes
      "process_count": 3
    }
  ],
  "summary": {
    "average_memory": 167772160,     // 160MB
    "peak_memory": 262144000,        // 250MB
    "average_processes": 2.5
  }
}
```

---

## **IMPLEMENTATION PLAN**

### **Phase 1: Foundation (Day 1)**
1. **Database Setup** (Depends on Elon)
   - Create memory schema tables
   - Set up indexes and constraints
   - Configure connection pooling

2. **Log Collector Service**
   - Implement activity capture middleware
   - Create buffering system
   - Add deduplication logic

### **Phase 2: Core Features (Day 2)**
1. **Search & Retrieval API**
   - Implement full-text search
   - Create filtering system
   - Add pagination and sorting

2. **Data Aggregation Engine**
   - Implement real-time aggregation
   - Create scheduled aggregation jobs
   - Build metrics calculation logic

### **Phase 3: Integration & Polish (Day 3)**
1. **Dashboard Integration**
   - Connect to main dashboard API
   - Implement real-time WebSocket updates
   - Create memory usage visualization

2. **Performance Optimization**
   - Query optimization
   - Caching implementation
   - Load testing and tuning

---

## **DEPENDENCIES**

### **Required from Elon (CTO):**
1. Database instance (PostgreSQL/SQLite) with connection details
2. Database schema approval and any modifications
3. Real-time data collection hooks from agent monitoring system

### **Required from Lui (COO):**
1. Agent activity event specifications
2. Dashboard API integration requirements
3. Performance expectations and SLAs

### **Required from Warren (Strategy):**
1. Key metrics definitions for agent performance
2. Memory usage thresholds and alerts
3. Search relevance criteria

---

## **DELIVERABLES TIMELINE**

### **Day 1 (Today - 2026-04-10):**
- [ ] Complete memory system design document
- [ ] Create database migration scripts
- [ ] Implement basic log collector service
- [ ] Update project board with progress

### **Day 2 (Tomorrow - 2026-04-11):**
- [ ] Complete search API implementation
- [ ] Implement data aggregation engine
- [ ] Create memory usage tracking
- [ ] Basic integration testing

### **Day 3 (Day After - 2026-04-12):**
- [ ] Dashboard integration complete
- [ ] Performance optimization
- [ ] Documentation and final testing
- [ ] Handoff to main dashboard integration

---

## **RISKS & MITIGATION**

### **Risk 1: Database Schema Changes**
- **Risk:** Elon's database design may require schema adjustments
- **Mitigation:** Design flexible schema with JSONB fields for extensibility
- **Contingency:** Plan for schema migration scripts

### **Risk 2: Performance Under Load**
- **Risk:** High-volume agent activities may overwhelm system
- **Mitigation:** Implement buffering, batching, and rate limiting
- **Contingency:** Add horizontal scaling capability

### **Risk 3: Search Relevance**
- **Risk:** Search results may not be relevant enough
- **Mitigation:** Implement relevance scoring with configurable weights
- **Contingency:** Add manual relevance feedback system

### **Risk 4: Memory Overhead**
- **Risk:** Memory system itself consumes significant resources
- **Mitigation:** Optimize queries, implement efficient indexing
- **Contingency:** Add resource usage monitoring and alerts

---

## **NEXT STEPS**

1. **Immediate:** Share this design with Elon for database schema alignment
2. **Today:** Begin implementing log collector service (independent of database)
3. **Today:** Create database migration scripts ready for Elon's database
4. **Tomorrow:** Start search API implementation once database is available

---

**Document Version:** 1.0
**Last Updated:** 2026-04-10 14:30 EDT
**Next Review:** After Elon's database schema is finalized