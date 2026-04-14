# Mission Control Dashboard - API Documentation

## Overview
The Mission Control Dashboard API provides REST endpoints and WebSocket communication for real-time agent monitoring, task management, and system metrics. This documentation covers all 15+ API endpoints created by Elon (CTO).

**Base URL:** `http://localhost:3000/api` (or your configured host:port)
**WebSocket URL:** `ws://localhost:3000`

---

## Table of Contents
1. [Health & Status](#health--status)
2. [Agent Management](#agent-management)
3. [Activity Tracking](#activity-tracking)
4. [Task Management](#task-management)
5. [Dashboard Views](#dashboard-views)
6. [Memory System](#memory-system)
7. [Metrics & Monitoring](#metrics--monitoring)
8. [WebSocket Protocol](#websocket-protocol)
9. [Error Handling](#error-handling)
10. [Usage Examples](#usage-examples)

---

## Health & Status

### GET `/api/health`
Check server health and status.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2026-04-10T14:35:00.000Z",
  "uptime": 1234.56,
  "connections": 5
}
```

**Fields:**
- `status`: Server status ("ok" or "error")
- `timestamp`: Current server time in ISO format
- `uptime`: Server uptime in seconds
- `connections`: Number of active WebSocket connections

---

## Agent Management

### GET `/api/agents`
Get a list of all agents.

**Query Parameters:**
- `status` (optional): Filter by agent status (active, busy, error, offline)
- `role` (optional): Filter by agent role

**Response:**
```json
[
  {
    "id": "agent_1",
    "name": "Lui",
    "role": "COO",
    "status": "active",
    "avatar": "🦞",
    "color": "#2563eb",
    "tasks": 3,
    "progress": 75,
    "uptime": "24h",
    "cpu": 45,
    "last_seen": "2026-04-10T14:30:00.000Z",
    "current_task": "Project coordination"
  }
]
```

### GET `/api/agents/:id`
Get details for a specific agent.

**Path Parameters:**
- `id`: Agent ID

**Response:** Same as GET `/api/agents` but for a single agent.

### PATCH `/api/agents/:id/status`
Update agent status.

**Request Body:**
```json
{
  "status": "busy"
}
```

**Valid Status Values:** `active`, `busy`, `error`, `offline`

**Response:**
```json
{
  "success": true,
  "message": "Agent status updated"
}
```

**Note:** This triggers a WebSocket broadcast to all dashboard clients.

---

## Activity Tracking

### GET `/api/agents/:id/activities`
Get recent activities for a specific agent.

**Query Parameters:**
- `limit` (optional): Number of activities to return (default: 50)

**Response:**
```json
[
  {
    "id": "activity_1",
    "agent_id": "agent_1",
    "activity_type": "task_start",
    "description": "Started project coordination",
    "metadata": {
      "task_id": "task_1",
      "project": "Mission Control"
    },
    "timestamp": "2026-04-10T14:25:00.000Z"
  }
]
```

### GET `/api/activities/recent`
Get recent activities across all agents.

**Query Parameters:**
- `limit` (optional): Number of activities to return (default: 100)

**Response:** Same format as agent-specific activities.

---

## Task Management

### GET `/api/tasks`
Get all tasks with optional filtering.

**Query Parameters:**
- `status` (optional): Filter by task status (todo, in_progress, review, done)
- `assigned_to` (optional): Filter by assigned agent ID
- `priority` (optional): Filter by priority (low, medium, high, critical)

**Response:**
```json
[
  {
    "id": 1,
    "title": "Create API documentation",
    "description": "Document all 15+ API endpoints",
    "assigned_to": "agent_1",
    "created_by": "agent_2",
    "status": "in_progress",
    "priority": "high",
    "due_date": "2026-04-11T12:00:00.000Z",
    "created_at": "2026-04-10T14:00:00.000Z",
    "updated_at": "2026-04-10T14:30:00.000Z"
  }
]
```

### POST `/api/tasks`
Create a new task.

**Request Body:**
```json
{
  "title": "Create API documentation",
  "description": "Document all 15+ API endpoints",
  "assigned_to": "agent_1",
  "created_by": "agent_2",
  "priority": "high",
  "due_date": "2026-04-11T12:00:00.000Z"
}
```

**Required Fields:** `title`, `created_by`

**Response:**
```json
{
  "success": true,
  "taskId": 1,
  "message": "Task created successfully"
}
```

**Note:** This triggers a WebSocket broadcast to all dashboard clients.

### PATCH `/api/tasks/:id/status`
Update task status.

**Request Body:**
```json
{
  "status": "done"
}
```

**Valid Status Values:** `todo`, `in_progress`, `review`, `done`

**Response:**
```json
{
  "success": true,
  "message": "Task status updated"
}
```

**Note:** This triggers a WebSocket broadcast to all dashboard clients.

### POST `/api/tasks/:id/updates`
Add an update or comment to a task.

**Request Body:**
```json
{
  "agent_id": "agent_1",
  "update_type": "comment",
  "content": "Documentation is 50% complete",
  "metadata": {
    "progress": 50
  }
}
```

**Required Fields:** `agent_id`, `update_type`

**Valid Update Types:** `comment`, `progress_update`, `attachment`, `status_change`

**Response:**
```json
{
  "success": true,
  "message": "Task update added"
}
```

---

## Dashboard Views

### GET `/api/dashboard/stats`
Get dashboard statistics.

**Response:**
```json
{
  "total_agents": 8,
  "active_agents": 6,
  "total_tasks": 25,
  "completed_tasks": 15,
  "pending_tasks": 10,
  "today_activities": 142,
  "system_uptime": "3d 5h 12m",
  "memory_usage": "1.2GB / 4.0GB"
}
```

### GET `/api/dashboard/agent-status`
Get agent status view (optimized for dashboard display).

**Response:**
```json
[
  {
    "agent_id": "agent_1",
    "agent_name": "Lui",
    "status": "active",
    "current_task": "Project coordination",
    "task_count": 3,
    "last_activity": "2026-04-10T14:30:00.000Z",
    "activity_count_24h": 42
  }
]
```

### GET `/api/dashboard/project-progress`
Get project progress over time.

**Query Parameters:**
- `days` (optional): Number of days to include (default: 7)

**Response:**
```json
[
  {
    "date": "2026-04-10",
    "tasks_created": 5,
    "tasks_completed": 3,
    "completion_rate": 60,
    "agent_count": 8
  }
]
```

---

## Memory System

### GET `/api/memory/search`
Search memory entries.

**Query Parameters:**
- `q` (required): Search query
- `agent_id` (optional): Filter by agent ID
- `limit` (optional): Maximum results (default: 50)

**Response:**
```json
[
  {
    "id": "memory_1",
    "agent_id": "agent_1",
    "agent_name": "Lui",
    "content": "Created project coordination system",
    "type": "activity",
    "timestamp": "2026-04-10T14:25:00.000Z",
    "relevance": 0.85
  }
]
```

---

## Metrics & Monitoring

### POST `/api/metrics`
Record a system metric.

**Request Body:**
```json
{
  "metric_type": "cpu_usage",
  "value": 45.5,
  "unit": "percent",
  "agent_id": "agent_1"
}
```

**Required Fields:** `metric_type`, `value`

**Common Metric Types:** `cpu_usage`, `memory_usage`, `response_time`, `error_rate`, `task_completion_time`

**Response:**
```json
{
  "success": true,
  "message": "Metric recorded"
}
```

### GET `/api/metrics/recent`
Get recent metrics.

**Query Parameters:**
- `metric_type` (optional): Filter by metric type
- `agent_id` (optional): Filter by agent ID
- `limit` (optional): Maximum results (default: 100)

**Response:**
```json
[
  {
    "id": 1,
    "metric_type": "cpu_usage",
    "value": 45.5,
    "unit": "percent",
    "agent_id": "agent_1",
    "timestamp": "2026-04-10T14:30:00.000Z"
  }
]
```

### GET `/api/connections/active`
Get active WebSocket connections.

**Response:**
```json
[
  {
    "connection_id": "conn_123456789",
    "agent_id": "agent_1",
    "client_type": "dashboard",
    "ip_address": "192.168.1.100",
    "user_agent": "Mozilla/5.0...",
    "connected_at": "2026-04-10T14:25:00.000Z",
    "last_activity": "2026-04-10T14:30:00.000Z"
  }
]
```

---

## WebSocket Protocol

### Connection
Connect to: `ws://localhost:3000`

### Authentication
Send authentication message after connection:
```json
{
  "type": "authenticate",
  "data": {
    "agentId": "agent_1"
  }
}
```

**Response:**
```json
{
  "type": "authenticated",
  "agentId": "agent_1",
  "timestamp": "2026-04-10T14:30:00.000Z"
}
```

### Heartbeat
Send periodic heartbeat to maintain connection:
```json
{
  "type": "heartbeat"
}
```

**Response:**
```json
{
  "type": "heartbeat_response",
  "timestamp": "2026-04-10T14:30:00.000Z"
}
```

### Activity Logging
Log agent activities:
```json
{
  "type": "agent_activity",
  "data": {
    "activityType": "task_start",
    "description": "Started documentation",
    "metadata": {
      "task_id": "task_1"
    }
  }
}
```

### Received Messages (Dashboard Clients)

#### Agent Status Update
```json
{
  "type": "agent_status_update",
  "data": {
    "agentId": "agent_1",
    "name": "Lui",
    "status": "active",
    "lastSeen": "2026-04-10T14:30:00.000Z"
  }
}
```

#### Task Created
```json
{
  "type": "task_created",
  "data": {
    "taskId": 1,
    "title": "Create API documentation",
    "assigned_to": "agent_1",
    "created_by": "agent_2"
  }
}
```

#### Task Status Updated
```json
{
  "type": "task_status_updated",
  "data": {
    "taskId": 1,
    "status": "done"
  }
}
```

#### Agent Activity
```json
{
  "type": "agent_activity",
  "data": {
    "agentId": "agent_1",
    "activityType": "task_start",
    "description": "Started documentation",
    "timestamp": "2026-04-10T14:30:00.000Z"
  }
}
```

---

## Error Handling

### Error Responses
All errors follow this format:
```json
{
  "error": "Error message description"
}
```

### HTTP Status Codes
- `200`: Success
- `201`: Created
- `400`: Bad Request (invalid input)
- `404`: Not Found
- `500`: Internal Server Error

### Common Errors
- `Agent not found`: Agent ID doesn't exist
- `Status is required`: Missing required field
- `Title and created_by are required`: Missing required fields for task creation
- `Failed to get agents`: Database error

---

## Usage Examples

### JavaScript Fetch Example
```javascript
// Get all agents
const response = await fetch('http://localhost:3000/api/agents');
const agents = await response.json();

// Create a task
const taskResponse = await fetch('http://localhost:3000/api/tasks', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: 'New Task',
    description: 'Task description',
    created_by: 'agent_1',
    priority: 'medium'
  })
});
```

### WebSocket Client Example
```javascript
const ws = new WebSocket('ws://localhost:3000');

ws.onopen = () => {
  console.log('Connected to dashboard');
  
  // Authenticate
  ws.send(JSON.stringify({
    type: 'authenticate',
    data: { agentId: 'agent_1' }
  }));
  
  // Send heartbeat every 30 seconds
  setInterval(() => {
    ws.send(JSON.stringify({ type: 'heartbeat' }));
  }, 30000);
};

ws.onmessage = (event) => {
  const message = JSON.parse(event.data);
  console.log('Received:', message);
  
  switch (message.type) {
    case 'agent_status_update':
      updateAgentStatus(message.data);
      break;
    case 'task_created':
      addNewTask(message.data);
      break;
  }
};
```

### cURL Examples
```bash
# Get all agents
curl http://localhost:3000/api/agents

# Create a task
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "New Task",
    "description": "Task description",
    "created_by": "agent_1",
    "priority": "medium"
  }'

# Update agent status
curl -X PATCH http://localhost:3000/api/agents/agent_1/status \
  -H "Content-Type: application/json" \
  -d '{"status": "busy"}'
```

---

## Configuration

### Environment Variables
```bash
PORT=3000                    # Server port
HOST=localhost               # Server host
NODE_ENV=production          # Environment (development/production)
DATABASE_PATH=./mission_control.db  # SQLite database path
```

### Starting the Server
```bash
# Install dependencies
npm install

# Initialize database
node initDatabase.js

# Start server
node server.js

# Or use the startup script
./start.sh
```

---

## Integration Notes

### Data Format Consistency
- All timestamps use ISO 8601 format
- Status values are lowercase strings
- IDs can be strings or integers
- JSON is used for all request/response bodies

### Rate Limiting
- No built-in rate limiting (consider adding for production)
- WebSocket connections should send heartbeats every 30 seconds
- Database connections are pooled automatically

### Security Considerations
- CORS is enabled for all origins (configure for production)
- Helmet.js provides security headers
- Input validation is minimal (add validation middleware for production)
- No authentication required (add JWT for production)

---

**Documentation Version:** 1.0  
**Last Updated:** 2026-04-10  
**Created by:** Buzz (CCO) based on Elon's API implementation