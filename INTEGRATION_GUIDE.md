# Mission Control Dashboard - Integration Guide

## Overview
This guide explains how all components of the Mission Control Dashboard connect and work together. It covers the integration points between Elon's API, Lens's UI, Brains's Memory System, and other team components.

**Integration Status:** 🟡 IN PROGRESS (Phase 2)

---

## Table of Contents
1. [System Architecture](#system-architecture)
2. [Component Integration Points](#component-integration-points)
3. [Data Flow Diagrams](#data-flow-diagrams)
4. [API Integration](#api-integration)
5. [WebSocket Integration](#websocket-integration)
6. [Memory System Integration](#memory-system-integration)
7. [UI Integration](#ui-integration)
8. [Testing Integration](#testing-integration)
9. [Troubleshooting Integration](#troubleshooting-integration)
10. [Future Integration Roadmap](#future-integration-roadmap)

---

## System Architecture

### High-Level Architecture
```
┌─────────────────────────────────────────────────────────────┐
│                    Dashboard Clients                         │
│  (Browser, Mobile, API Consumers)                           │
└──────────────────────────────┬──────────────────────────────┘
                               │ HTTP/WebSocket
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                    Express Server                           │
│  (server.js)                                                │
│  • REST API (15+ endpoints)                                 │
│  • WebSocket Server                                         │
│  • Static File Serving                                      │
└──────────────────────┬─────────────────┬────────────────────┘
                       │                 │
                       ▼                 ▼
        ┌─────────────────────┐ ┌─────────────────────┐
        │   Data Access Layer │ │   Memory Service    │
        │   (db.js)           │ │   (memory-service.js)│
        │   • SQLite queries  │ │   • Memory logging  │
        │   • Business logic  │ │   • Search          │
        └─────────────────────┘ └─────────────────────┘
                       │                 │
                       ▼                 ▼
        ┌─────────────────────────────────────────────┐
        │            SQLite Database                  │
        │            (mission_control.db)             │
        │  • 7 tables + 2 views                       │
        │  • Agent, Task, Activity data               │
        │  • Memory system tables                     │
        └─────────────────────────────────────────────┘
```

### Component Relationships
```
        Elon (CTO)                    Lens (Media)
        ┌─────────┐                  ┌─────────┐
        │ REST API│◄────────────────►│   UI    │
        │ WebSocket│                  │Components│
        └────┬────┘                  └────┬────┘
             │                            │
             ▼                            ▼
        ┌─────────────────────────────────────┐
        │         Express Server              │
        └─────────────────────────────────────┘
             │                            │
             ▼                            ▼
        ┌─────────┐                  ┌─────────┐
        │Database │◄────────────────►│  Brains │
        │ (SQLite)│                  │ (Memory)│
        └─────────┘                  └─────────┘
```

---

## Component Integration Points

### 1. Elon's API Server (server.js)
**Location:** `/home/user/.openclaw/workspace/server.js`
**Integration Points:**
- REST API endpoints for all data operations
- WebSocket server for real-time updates
- Database connection via db.js
- Static file serving for UI

**Key Integration Methods:**
```javascript
// REST API endpoints
app.get('/api/agents', ...)           // Used by Lens's UI
app.post('/api/tasks', ...)           // Used by all agents
app.get('/api/memory/search', ...)    // Used by Brains's memory system

// WebSocket events
wss.on('connection', ...)             // Real-time dashboard updates
broadcastToDashboards(...)            // Notify all connected clients
```

### 2. Lens's UI Components (ui-design/)
**Location:** `/home/user/.openclaw/workspace/ui-design/`
**Integration Points:**
- `components.css` - Styling for dashboard
- `components.js` - Interactive components
- `wireframes/dashboard-overview.html` - Main dashboard prototype

**Expected Data Format:**
```javascript
// Agent data expected by UI
{
  id: 'agent_1',
  name: 'Lui',
  role: 'COO',
  status: 'active',
  avatar: '🦞',
  color: '#2563eb',
  tasks: 3,
  progress: 75,
  uptime: '24h',
  cpu: 45,
  lastUpdate: '2026-04-10T14:30:00.000Z',
  currentTask: 'Project coordination'
}
```

### 3. Brains's Memory System (memory-service.js)
**Location:** `/home/user/.openclaw/workspace/memory-service.js`
**Integration Points:**
- Memory logging via WebSocket or API
- Search functionality via `/api/memory/search`
- Integration with agent_activities table

**Memory Service Methods:**
```javascript
// Log agent activity
await memoryService.logActivity({
  agent_id: 'agent_1',
  agent_name: 'Lui',
  activity_type: 'task_complete',
  activity_data: { task_id: 'task_1' }
});

// Search memories
const results = await memoryService.searchMemories('documentation', 50);
```

### 4. Database Schema (mission_control.db)
**Location:** `/home/user/.openclaw/workspace/mission_control.db`
**Tables:**
1. `agents` - Agent information (used by UI)
2. `agent_activities` - Activity logs (used by Memory system)
3. `tasks` - Task management (used by all components)
4. `task_updates` - Task progress (used by UI)
5. `system_metrics` - Performance data (used by Dashboard)
6. `memory_entries` - Memory system (used by Brains)
7. `websocket_connections` - Connection tracking (used by WebSocket)

**Views:**
1. `agent_status_view` - Optimized for dashboard
2. `project_progress_view` - Progress tracking

---

## Data Flow Diagrams

### 1. Agent Status Update Flow
```
Agent (e.g., Lui) → WebSocket → Server → Database → Dashboard UI
      │                     │          │           │
      │                     │          │           │
      └───► Activity Log ──┘          │           │
                                      │           │
                                Memory System ◄──┘
```

**Sequence:**
1. Agent sends WebSocket message: `{type: 'agent_activity', data: {...}}`
2. Server processes and stores in `agent_activities` table
3. Server updates `agents` table status
4. Server broadcasts to all dashboard clients
5. Dashboard UI updates in real-time
6. Memory system logs the activity for historical tracking

### 2. Task Creation Flow
```
User/Dashboard → REST API → Server → Database → WebSocket → All Dashboards
      │                                           │
      │                                           │
      └───────────────────► Task Board UI ◄──────┘
```

**Sequence:**
1. User creates task via UI or API: `POST /api/tasks`
2. Server validates and stores in `tasks` table
3. Server creates initial `task_updates` entry
4. Server broadcasts `task_created` via WebSocket
5. All connected dashboards update their task boards
6. Assigned agent receives notification

### 3. Memory Search Flow
```
Dashboard UI → REST API → Server → Database → Memory Service → Results
      │                                                     │
      │                                                     │
      └───────────────────────◄ JSON Response ◄────────────┘
```

**Sequence:**
1. User searches in dashboard: `GET /api/memory/search?q=query`
2. Server calls memory service search method
3. Memory service queries `memory_entries` and `agent_activities`
4. Results ranked by relevance
5. JSON response sent to dashboard
6. UI displays search results

### 4. Real-time Dashboard Update Flow
```
Server Events → WebSocket Broadcast → Dashboard Clients → UI Updates
     │                  │                     │
     │                  │                     │
Agent Activities    Task Updates         Theme Changes
System Metrics      Status Changes       Notifications
```

**Events Broadcast:**
- `agent_status_update`
- `task_created`
- `task_status_updated`
- `agent_activity`
- `system_alert`

---

## API Integration

### REST API Integration Points

#### 1. Dashboard Statistics
**UI Component:** Stats sidebar, header
**API Endpoint:** `GET /api/dashboard/stats`
**Data Format:**
```json
{
  "total_agents": 8,
  "active_agents": 6,
  "total_tasks": 25,
  "completed_tasks": 15,
  "pending_tasks": 10
}
```

**Integration Code:**
```javascript
// In components.js
async function updateDashboardStats() {
  const response = await fetch('/api/dashboard/stats');
  const stats = await response.json();
  
  // Update UI elements
  document.getElementById('total-agents').textContent = stats.total_agents;
  document.getElementById('active-agents').textContent = stats.active_agents;
  // ... etc
}
```

#### 2. Agent Cards
**UI Component:** Agent grid/cards
**API Endpoint:** `GET /api/agents`
**Integration:** Real-time updates via WebSocket

```javascript
// Initial load
const agents = await fetch('/api/agents').then(r => r.json());
renderAgentCards(agents);

// Real-time updates
ws.onmessage = (event) => {
  const msg = JSON.parse(event.data);
  if (msg.type === 'agent_status_update') {
    updateAgentCard(msg.data);
  }
};
```

#### 3. Task Board
**UI Component:** Kanban board
**API Endpoints:**
- `GET /api/tasks` - Load tasks
- `POST /api/tasks` - Create task
- `PATCH /api/tasks/:id/status` - Update status

```javascript
// Load tasks with filters
const tasks = await fetch('/api/tasks?status=todo').then(r => r.json());
renderTaskBoard(tasks);

// Drag-and-drop integration
taskElement.addEventListener('dragend', async () => {
  const newStatus = getColumnStatus(targetColumn);
  await fetch(`/api/tasks/${taskId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status: newStatus })
  });
});
```

#### 4. Activity Feed
**UI Component:** Activity timeline
**API Endpoint:** `GET /api/activities/recent`
**WebSocket Events:** `agent_activity`

```javascript
// Load recent activities
const activities = await fetch('/api/activities/recent?limit=50')
  .then(r => r.json());
renderActivityFeed(activities);

// Real-time updates
ws.onmessage = (event) => {
  const msg = JSON.parse(event.data);
  if (msg.type === 'agent_activity') {
    addActivityToFeed(msg.data);
  }
};
```

### WebSocket Integration

#### Client Connection
```javascript
// In components.js - WebSocket manager
class WebSocketManager {
  constructor() {
    this.ws = new WebSocket(`ws://${window.location.host}`);
    this.setupEventHandlers();
  }
  
  setupEventHandlers() {
    this.ws.onopen = () => {
      console.log('Connected to dashboard server');
      this.authenticate();
      this.startHeartbeat();
    };
    
    this.ws.onmessage = (event) => {
      this.handleMessage(JSON.parse(event.data));
    };
  }
  
  authenticate() {
    this.ws.send(JSON.stringify({
      type: 'authenticate',
      data: { agentId: 'dashboard_client' }
    }));
  }
  
  startHeartbeat() {
    setInterval(() => {
      this.ws.send(JSON.stringify({ type: 'heartbeat' }));
    }, 30000);
  }
  
  handleMessage(message) {
    switch (message.type) {
      case 'agent_status_update':
        AgentManager.updateAgent(message.data);
        break;
      case 'task_created':
        TaskBoard.addTask(message.data);
        break;
      case 'task_status_updated':
        TaskBoard.updateTask(message.data);
        break;
      case 'agent_activity':
        ActivityFeed.addActivity(message.data);
        break;
    }
  }
}
```

#### Server-Side Integration
```javascript
// In server.js - WebSocket handlers
wss.on('connection', (ws, req) => {
  // Connection established
  const connectionId = generateConnectionId();
  
  // Store connection
  connections.set(connectionId, { ws, /* ... */ });
  
  // Send welcome
  ws.send(JSON.stringify({
    type: 'welcome',
    connectionId,
    message: 'Connected to Mission Control Dashboard'
  }));
  
  // Handle messages
  ws.on('message', async (data) => {
    const message = JSON.parse(data.toString());
    await handleWebSocketMessage(connectionId, message);
  });
});

// Broadcast to all dashboards
function broadcastToDashboards(message) {
  const messageStr = JSON.stringify(message);
  connections.forEach((connection) => {
    if (connection.ws.readyState === WebSocket.OPEN) {
      connection.ws.send(messageStr);
    }
  });
}
```

---

## Memory System Integration

### Integration with Agent Activities

#### 1. Automatic Activity Logging
```javascript
// In server.js - When agent activity received via WebSocket
case 'agent_activity':
  if (connection.agentId && data.activityType) {
    // Store in database
    await db.createAgentActivity(
      connection.agentId,
      data.activityType,
      data.description,
      data.metadata
    );
    
    // Also log to memory system
    await memoryService.logActivity({
      agent_id: connection.agentId,
      agent_name: data.agentName,
      activity_type: data.activityType,
      activity_data: data.metadata
    });
    
    // Broadcast to dashboards
    broadcastToDashboards({
      type: 'agent_activity',
      data: { /* ... */ }
    });
  }
  break;
```

#### 2. Memory Search Integration
```javascript
// API endpoint in server.js
app.get('/api/memory/search', async (req, res) => {
  try {
    const { q, agent_id, limit } = req.query;
    
    if (!q) {
      return res.status(400).json({ error: 'Search query (q) is required' });
    }
    
    // Use memory service for search
    const results = await memoryService.searchMemories(
      q,
      agent_id || null,
      parseInt(limit) || 50
    );
    
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: 'Failed to search memory' });
  }
});
```

#### 3. Dashboard Integration
```javascript
// In UI - Search component
class MemorySearch {
  async search(query, filters = {}) {
    const params = new URLSearchParams({ q: query });
    if (filters.agent_id) params.append('agent_id', filters.agent_id);
    if (filters.limit) params.append('limit', filters.limit);
    
    const response = await fetch(`/api/memory/search?${params}`);
    return await response.json();
  }
  
  renderResults(results) {
    // Display in dashboard search panel
    results.forEach(result => {
      this.addSearchResult(result);
    });
  }
}
```

### Memory Service Configuration
```javascript
// Initialize memory service
const memoryService = new MemoryService(process.env.DATABASE_PATH);

// Integrate with server startup
async function initializeServer() {
  await db.init();
  await memoryService.connect();
  console.log('Memory service connected');
}

// Use in API endpoints
app.post('/api/memory/log', async (req, res) => {
  try {
    await memoryService.logActivity(req.body);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

---

## UI Integration

### Theme System Integration
**Files:** `components.css`, `components.js`
**Integration:** LocalStorage persistence, CSS custom properties

```css
/* components.css - Theme variables */
:root {
  --color-bg-primary: #ffffff;
  --color-text-primary: #1a1a1a;
  /* ... other light theme variables */
}

.theme-dark {
  --color-bg-primary: #1a1a1a;
  --color-text-primary: #ffffff;
  /* ... other dark theme variables */
}
```

```javascript
// components.js - Theme manager
class ThemeManager {
  constructor() {
    this.currentTheme = localStorage.getItem('dashboard-theme') || 'light';
    this.applyTheme(this.currentTheme);
  }
  
  applyTheme(theme) {
    document.documentElement.className = `theme-${theme}`;
    localStorage.setItem('dashboard-theme', theme);
    this.currentTheme = theme;
  }
  
  toggleTheme() {
    const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    this.applyTheme(newTheme);
  }
}
```

### Component Library Integration
**File:** `components.js`
**Integration:** Reusable UI components

```javascript
// Agent card component
class AgentCard {
  constructor(agentData) {
    this.agent = agentData;
    this.element = this.createCard();
  }
  
  createCard() {
    const card = document.createElement('div');
    card.className = 'card agent-card';
    card.innerHTML = `
      <div class="agent-avatar" style="background-color: ${this.agent.color}">
        ${this.agent.avatar}
      </div>
      <h4 class="agent-name">${this.agent.name}</h4>
      <span class="agent-status status-${this.agent.status}">
        ${this.agent.status}
      </span>
      <div class="agent-metrics">
        <span class="metric">CPU: ${this.agent.cpu}%</span>
        <span class="metric">Tasks: ${this.agent.tasks