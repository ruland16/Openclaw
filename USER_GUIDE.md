# Mission Control Dashboard - User Guide

## Overview
The Mission Control Dashboard is a real-time monitoring and management system for OpenClaw agents. This guide covers all features and functionality for users and administrators.

**Target Users:**
- Project Managers (Lui, Warren)
- Technical Team (Elon, Brains)
- Creative Team (Lens, Buzz, Goldie)
- Life Manager (June)

---

## Table of Contents
1. [Getting Started](#getting-started)
2. [Dashboard Overview](#dashboard-overview)
3. [Agent Management](#agent-management)
4. [Task Management](#task-management)
5. [Activity Monitoring](#activity-monitoring)
6. [Memory System](#memory-system)
7. [System Metrics](#system-metrics)
8. [Real-time Features](#real-time-features)
9. [Troubleshooting](#troubleshooting)
10. [FAQs](#faqs)

---

## Getting Started

### Prerequisites
- Node.js 16+ installed
- Web browser (Chrome, Firefox, Safari, Edge)
- Basic understanding of OpenClaw agent system

### Quick Start
1. **Start the server:**
   ```bash
   cd /home/user/.openclaw/workspace
   ./start.sh
   ```
   Or manually:
   ```bash
   node initDatabase.js
   node server.js
   ```

2. **Access the dashboard:**
   Open your browser to: `http://localhost:3000`

3. **View the wireframe:**
   Open: `/home/user/.openclaw/workspace/ui-design/wireframes/dashboard-overview.html`

### Initial Setup
1. **Database initialization:** The `initDatabase.js` script creates sample data including:
   - 8 agents with different roles
   - 3 sample tasks
   - 3 recent activities
   - System metrics

2. **First-time configuration:**
   - Check `package.json` for dependencies
   - Run `npm install` if needed
   - Verify database at `mission_control.db`

---

## Dashboard Overview

### Main Layout
```
┌─────────────────────────────────────────────────────┐
│  Header: Logo, Theme Toggle, Notifications          │
├─────────────────────────────────────────────────────┤
│  Left Sidebar: Navigation, Quick Stats              │
├─────────────────────────────────────────────────────┤
│  Main Content:                                      │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐  │
│  │ Agent Cards │ │ Task Board  │ │ Activity    │  │
│  │             │ │             │ │ Feed        │  │
│  └─────────────┘ └─────────────┘ └─────────────┘  │
│  ┌─────────────────────────────────────────────┐  │
│  │             System Metrics                  │  │
│  │             & Charts                        │  │
│  └─────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
```

### Key Sections
1. **Header:**
   - Dashboard title
   - Theme toggle (light/dark)
   - Notification bell
   - User profile

2. **Sidebar:**
   - Navigation menu
   - Quick statistics
   - System status
   - Shortcuts

3. **Agent Cards:**
   - Real-time agent status
   - Current task
   - Performance metrics
   - Quick actions

4. **Task Board:**
   - Kanban-style columns (Todo, In Progress, Review, Done)
   - Drag-and-drop task management
   - Task details on click

5. **Activity Feed:**
   - Real-time agent activities
   - Filter by agent or activity type
   - Search functionality

6. **Metrics Dashboard:**
   - System performance charts
   - Agent productivity metrics
   - Custom time ranges

---

## Agent Management

### Viewing Agents
1. **All Agents View:**
   - Shows all 8 agents with their current status
   - Color-coded by status (green=active, yellow=busy, red=error, gray=offline)
   - Click any agent card for detailed view

2. **Agent Details:**
   - Agent information (name, role, avatar)
   - Current status and task
   - Performance metrics (CPU, memory, uptime)
   - Recent activities
   - Task history

### Agent Status
- **Active:** Agent is online and available
- **Busy:** Agent is working on a task
- **Error:** Agent encountered an error
- **Offline:** Agent is not connected

### Managing Agents
1. **Update Status:**
   ```javascript
   // Via API
   PATCH /api/agents/:id/status
   { "status": "busy" }
   ```

2. **View Activities:**
   ```javascript
   GET /api/agents/:id/activities?limit=50
   ```

3. **Monitor Performance:**
   - Check CPU usage in agent card
   - View task completion rate
   - Monitor uptime and reliability

### Best Practices
- Keep agents in "active" status when available
- Update to "busy" when working on intensive tasks
- Monitor error rates and investigate spikes
- Regular status updates maintain accurate monitoring

---

## Task Management

### Creating Tasks
1. **Quick Create:**
   - Click "+ New Task" button
   - Fill in title, description, assignee
   - Set priority and due date

2. **API Method:**
   ```javascript
   POST /api/tasks
   {
     "title": "Create documentation",
     "description": "Document API endpoints",
     "assigned_to": "agent_1",
     "created_by": "agent_2",
     "priority": "high",
     "due_date": "2026-04-11T12:00:00.000Z"
   }
   ```

### Task Board
1. **Columns:**
   - **Todo:** Newly created tasks
   - **In Progress:** Currently being worked on
   - **Review:** Ready for review
   - **Done:** Completed tasks

2. **Drag and Drop:**
   - Drag tasks between columns to update status
   - Automatic status update via API
   - Real-time sync across all dashboard clients

### Task Details
Click any task to view:
- Full description and requirements
- Assignee and creator
- Priority and due date
- Update history and comments
- Attachments and related files

### Task Updates
1. **Add Comments:**
   ```javascript
   POST /api/tasks/:id/updates
   {
     "agent_id": "agent_1",
     "update_type": "comment",
     "content": "Progress update: 50% complete"
   }
   ```

2. **Status Changes:**
   - Manual: Drag between columns
   - API: `PATCH /api/tasks/:id/status`
   - Automatic: Based on agent activities

### Task Filters
- **By Status:** Todo, In Progress, Review, Done
- **By Assignee:** Filter to specific agent
- **By Priority:** Low, Medium, High, Critical
- **By Due Date:** Overdue, Today, This Week

---

## Activity Monitoring

### Real-time Activity Feed
1. **What's Displayed:**
   - Agent login/logout events
   - Task start/completion
   - Status changes
   - Error occurrences
   - System events

2. **Activity Types:**
   - `task_start`: Agent started working on a task
   - `task_complete`: Agent completed a task
   - `status_update`: Agent status changed
   - `error`: Agent encountered an error
   - `system`: System-level event

### Filtering Activities
1. **By Agent:** Show only specific agent activities
2. **By Type:** Filter to certain activity types
3. **By Time:** Last hour, today, this week
4. **Search:** Text search across all activities

### Activity Details
Each activity shows:
- Timestamp (with relative time, e.g., "5 minutes ago")
- Agent name and avatar
- Activity type with icon
- Detailed description
- Any metadata or context

### Notifications
1. **Browser Notifications:**
   - Enable in browser settings
   - Get alerts for important activities
   - Customize notification types

2. **In-app Notifications:**
   - Notification bell in header
   - Unread count indicator
   - Mark as read functionality

---

## Memory System

### Overview
The memory system tracks and stores agent activities for historical analysis and search.

### Key Features
1. **Activity Logging:** All agent activities stored with metadata
2. **Search Functionality:** Full-text search across all memories
3. **Aggregation:** Daily/weekly/monthly summaries
4. **Analytics:** Performance trends and patterns

### Using Memory Search
1. **Basic Search:**
   ```javascript
   GET /api/memory/search?q=documentation
   ```

2. **Advanced Search:**
   ```javascript
   GET /api/memory/search?q=documentation&agent_id=agent_1&limit=100
   ```

3. **Search Results Include:**
   - Relevance score
   - Timestamp
   - Agent information
   - Full activity context

### Memory Views
1. **Recent Memories:** Last 100 activities
2. **Agent-specific:** Activities for a particular agent
3. **Project-based:** Activities related to specific projects
4. **Error Tracking:** All error occurrences

### Integration with Agents
Agents can log activities via WebSocket:
```javascript
{
  "type": "agent_activity",
  "data": {
    "activityType": "task_complete",
    "description": "Completed API documentation",
    "metadata": {
      "task_id": "task_1",
      "quality_score": 95
    }
  }
}
```

---

## System Metrics

### Available Metrics
1. **Agent Performance:**
   - CPU usage percentage
   - Memory consumption
   - Task completion rate
   - Uptime and reliability

2. **System Health:**
   - Total agents online/offline
   - Task completion rate
   - Error frequency
   - Response times

3. **Project Metrics:**
   - Tasks created/completed
   - Agent productivity
   - Project velocity
   - Milestone progress

### Viewing Metrics
1. **Dashboard Charts:**
   - Real-time line charts
   - Historical trends
   - Comparison views

2. **API Access:**
   ```javascript
   GET /api/metrics/recent?metric_type=cpu_usage&limit=50
   ```

3. **Custom Reports:**
   - Export to CSV/JSON
   - Custom time ranges
   - Agent comparisons

### Recording Metrics
1. **Automatic:**
   - System metrics recorded automatically
   - Agent activities include performance data
   - WebSocket connections tracked

2. **Manual:**
   ```javascript
   POST /api/metrics
   {
     "metric_type": "custom_metric",
     "value": 42.5,
     "unit": "points",
     "agent_id": "agent_1"
   }
   ```

### Alerting
1. **Threshold Alerts:**
   - CPU > 90% for 5 minutes
   - Memory > 80% usage
   - Agent offline > 30 minutes
   - Error rate > 5%

2. **Notification Methods:**
   - Dashboard notifications
   - Email alerts (future)
   - Webhook integrations (future)

---

## Real-time Features

### WebSocket Connection
1. **Establish Connection:**
   ```javascript
   const ws = new WebSocket('ws://localhost:3000');
   ```

2. **Authentication:**
   ```javascript
   ws.send(JSON.stringify({
     type: 'authenticate',
     data: { agentId: 'agent_1' }
   }));
   ```

3. **Heartbeat:**
   - Send every 30 seconds
   - Maintains connection
   - Updates agent last_seen timestamp

### Real-time Updates
1. **Agent Status:** Immediate status changes
2. **Task Updates:** New tasks and status changes
3. **Activities:** Live activity feed
4. **Metrics:** Real-time chart updates

### Multi-user Collaboration
1. **Simultaneous Users:**
   - Multiple dashboard clients supported
   - All updates broadcast to all clients
   - Conflict resolution via timestamp

2. **Presence Indicators:**
   - Show who else is viewing dashboard
   - Active user count
   - Last activity timestamps

### Performance Considerations
1. **Optimization:**
   - Efficient WebSocket message broadcasting
   - Client-side buffering for high-frequency updates
   - Debounced UI updates

2. **Scalability:**
   - SQLite suitable for moderate loads
   - Can migrate to PostgreSQL if needed
   - Horizontal scaling possible with Redis

---

## Troubleshooting

### Common Issues

#### 1. Server Won't Start
**Symptoms:**
- Port 3000 already in use
- Database initialization errors
- Missing dependencies

**Solutions:**
```bash
# Check if port is in use
lsof -i :3000

# Kill existing process
kill -9 $(lsof -t -i:3000)

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Check database permissions
ls -la mission_control.db
```

#### 2. Database Errors
**Symptoms:**
- "SQLITE_CANTOPEN" errors
- Missing tables
- Permission denied

**Solutions:**
```bash
# Reinitialize database
node initDatabase.js

# Check SQLite installation
sqlite3 --version

# Verify database file
file mission_control.db
```

#### 3. WebSocket Connection Issues
**Symptoms:**
- Connection timeout
- Authentication failures
- Disconnected frequently

**Solutions:**
```bash
# Check server is running
curl http://localhost:3000/api/health

# Test WebSocket connection
wscat -c ws://localhost:3000

# Check firewall settings
sudo ufw status
```

#### 4. Dashboard Display Issues
**Symptoms:**
- Missing data
- Charts not loading
- Styling problems

**Solutions:**
1. Clear browser cache
2. Check JavaScript console for errors
3. Verify API endpoints are accessible
4. Check CORS settings

### Debug Mode
Enable debug logging:
```bash
# Set environment variable
export DEBUG=mission-control:*

# Start server
node server.js
```

### Log Files
1. **Server Logs:** Console output from `server.js`
2. **Database Logs:** SQLite query logs (if enabled)
3. **Client Logs:** Browser developer console
4. **Activity Logs:** `agent_activities` table

### Recovery Procedures

#### Database Corruption
```bash
# Backup existing database
cp mission_control.db mission_control.db.backup

# Recreate from schema
rm mission_control.db
node initDatabase.js
```

#### Data Loss
1. Check `mission_control.db` file size
2. Verify tables exist: `sqlite3 mission_control.db ".tables"`
3. Restore from backup if available

#### Performance Issues
1. Check database size: `du -h mission_control.db`
2. Monitor memory usage: `htop` or `top`
3. Check active connections: `GET /api/connections/active`

---

## FAQs

### General
**Q: What browsers are supported?**
A: Chrome 80+, Firefox 75+, Safari 13+, Edge 80+

**Q: Can I run this on a different port?**
A: Yes, set `PORT` environment variable: `PORT=4000 node server.js`

**Q: Is there authentication?**
A: Not in current version. Add JWT authentication for production use.

### Agents
**Q: How do I add a new agent?**
A: Currently agents are defined in database initialization. Modify `initDatabase.js` to add new agents.

**Q: Can agents update their own status?**
A: Yes, via WebSocket authentication and activity logging.

**Q: What happens when an agent goes offline?**
A: Status changes to "offline" and last_seen timestamp is updated.

### Tasks
**Q: Can I assign a task to multiple agents?**
A: Currently one agent per task. Consider adding task groups for future.

**Q: How are due dates handled?**
A: ISO 8601 format. Overdue tasks highlighted in red.

**Q: Can I attach files to tasks?**
A: Not in current version. Metadata field can store file references.

### Data
**Q: Where is data stored?**
A: SQLite database at `mission_control.db`

**Q: How do I backup the database?**
A: Copy `mission_control.db` file or use `backup.sh` script.

**Q: Can I export data?**
A: Use SQLite tools or add export feature to dashboard.

### Integration
**Q: Can I integrate with other systems?**
A: Yes, via REST API and WebSocket connections.

**Q: Is there a mobile app?**
A: Not yet, but dashboard is responsive for mobile browsers.

**Q: Can I customize the dashboard?**
A: Yes, modify UI files in `ui-design/` directory.

### Performance
**Q: How many agents can it handle?**
A: Tested with 8 agents. SQLite can handle 50+ with proper indexing.

**Q: What's the memory footprint?**
A: ~50MB for server, plus browser memory for dashboard.

**Q: How often should I backup?**
A: Daily for active use, or use continuous backup script.

---

## Support & Resources

### Documentation
- `API_DOCUMENTATION.md` - Complete API reference
- `TECHNICAL_IMPLEMENTATION.md` - Technical details
- `INTEGRATION_GUIDE.md` - Component integration

### Source Files
- `server.js` - Main server implementation
- `db.js` - Data Access Layer
- `ui-design/` - Frontend components

### Team Contacts
- **Lui (COO):** Project coordination
- **Elon (CTO):** Technical issues
- **Lens (Media):** UI/UX questions
- **Brains (CMO):** Memory system
- **Buzz (CCO):** Documentation

### Getting Help
1. Check troubleshooting section
2. Review API documentation
3. Examine server logs
4. Contact relevant team member

---

## Version History

### v1.0 (Current)
- Real-time agent monitoring
- Task management system
