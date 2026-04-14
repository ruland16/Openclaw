# Mission Control Dashboard

A unified dashboard for managing OpenClaw multi-agent organizations with real-time monitoring, task management, and agent coordination.

## 🚀 Features

- **Real-time Agent Monitoring**: Track status, activities, and performance of all agents
- **Task Management**: Create, assign, and track tasks across the organization
- **Memory System Integration**: Log and search agent activities and memories
- **WebSocket Support**: Real-time updates for instant dashboard refresh
- **Responsive UI**: Works on desktop, tablet, and mobile devices
- **Theme Support**: Dark/light mode with automatic persistence

## 🏗️ Architecture

### Components Integrated:
1. **Elon's Backend** (CTO): REST API + WebSocket server + SQLite database
2. **Lens's Frontend** (Media Producer): UI components, design system, responsive layout
3. **Brains's Memory System** (CMO): Activity logging, memory search, data persistence
4. **June's Coordination** (Life Manager): Team tracking, workload monitoring
5. **Buzz's Documentation** (CCO): User guides, API documentation
6. **Goldie's UX** (Marketing Chief): User experience, onboarding flows

### Tech Stack:
- **Backend**: Node.js, Express, WebSocket, SQLite
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Database**: SQLite with 7 tables + 2 views
- **Real-time**: WebSocket for instant updates
- **Styling**: Custom CSS with CSS variables for theming

## 📦 Installation

1. **Navigate to dashboard directory:**
   ```bash
   cd /home/user/.openclaw/workspace/dashboard-app
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the dashboard:**
   ```bash
   npm start
   ```

4. **Access the dashboard:**
   - Open browser to: http://localhost:3000
   - WebSocket: ws://localhost:3000
   - API: http://localhost:3000/api

## 🔌 API Endpoints

### Agents
- `GET /api/agents` - List all agents
- `GET /api/agents/:id` - Get agent details
- `POST /api/agents` - Create new agent
- `PUT /api/agents/:id/status` - Update agent status

### Tasks
- `GET /api/tasks` - List all tasks
- `GET /api/tasks/:id` - Get task details
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task

### Memory
- `GET /api/memory` - Search memories
- `POST /api/memory/log` - Log new activity
- `GET /api/memory/activities` - Get activity feed

### Metrics
- `GET /api/metrics` - Get system metrics
- `GET /api/metrics/agents` - Get agent performance metrics

## 🌐 WebSocket Events

### Client → Server:
- `subscribe` - Subscribe to updates
- `agent_status_update` - Update agent status
- `task_update` - Update task
- `activity_log` - Log activity

### Server → Client:
- `agent_status_updated` - Agent status changed
- `task_updated` - Task updated
- `activity_logged` - New activity logged
- `connection_established` - WebSocket connected

## 🎨 UI Components

### Design System:
- **Colors**: Semantic color palette for statuses
- **Typography**: Consistent font scale
- **Spacing**: 4px-based spacing system
- **Components**: Cards, buttons, forms, alerts, badges

### Pages:
1. **Dashboard Overview** - System stats and agent status
2. **Agent Management** - View and manage all agents
3. **Task Management** - Create and track tasks
4. **Memory System** - Search and view activities
5. **Metrics** - Performance analytics
6. **Activity Feed** - Real-time activity stream
7. **Settings** - System configuration

## 🔧 Configuration

### Environment Variables:
```bash
PORT=3000
API_BASE_URL=http://localhost:3000
NODE_ENV=production
```

### Database:
- Location: `/home/user/.openclaw/workspace/mission_control.db`
- Schema: 7 tables (agents, tasks, activities, metrics, memory, connections, config)
- Views: 2 views for aggregated data

## 🧪 Testing

1. **Test API endpoints:**
   ```bash
   curl http://localhost:3000/api/agents
   curl http://localhost:3000/health
   ```

2. **Test WebSocket connection:**
   ```bash
   # Use wscat or browser developer tools
   ```

3. **Test frontend:**
   - Open http://localhost:3000 in browser
   - Verify real-time updates work
   - Test theme switching
   - Verify responsive design

## 📈 Monitoring

### Health Checks:
- `GET /health` - System health status
- Database connection status
- WebSocket connection count
- Memory usage

### Metrics Tracked:
- Agent response times
- Task completion rates
- System uptime
- Memory usage trends
- Activity volume

## 🤝 Team Integration

### Agent Roles:
- **Lui (COO)**: Project coordination, dashboard unification
- **Elon (CTO)**: Technical infrastructure, API development
- **Lens (Media)**: UI/UX design, frontend development
- **Brains (CMO)**: Memory system, data persistence
- **Warren (Strategy)**: Requirements, KPIs, specifications
- **Buzz (CCO)**: Documentation, user guides
- **Goldie (Marketing)**: User experience, onboarding
- **June (Life Manager)**: Team coordination, progress tracking

### Communication:
- Daily standups at 9:00 AM EDT
- Real-time updates via WebSocket
- Activity logging for all operations
- Project board for task tracking

## 🚨 Troubleshooting

### Common Issues:

1. **Dashboard not loading:**
   - Check if server is running: `npm start`
   - Verify port 3000 is available
   - Check database connection

2. **WebSocket not connecting:**
   - Verify WebSocket server is running
   - Check browser console for errors
   - Test with `wscat -c ws://localhost:3000`

3. **No data showing:**
   - Check database has data
   - Verify API endpoints return data
   - Check browser network tab

4. **Theme not persisting:**
   - Clear browser localStorage
   - Check JavaScript console for errors
   - Verify theme toggle is working

### Logs:
- Server logs in console
- Database logs in mission_control.db
- Activity logs in activities table
- Error logs in server console

## 📚 Documentation

### Additional Resources:
- `API_DOCUMENTATION.md` - Complete API reference
- `USER_GUIDE.md` - User guide and tutorials
- `DEPLOYMENT_GUIDE.md` - Deployment instructions
- `INTEGRATION_GUIDE.md` - Component integration guide

### Development:
- Code organized by feature
- Modular architecture
- Comprehensive comments
- Error handling throughout

## 📄 License

MIT License - See LICENSE file for details.

## 👥 Credits

**Project Lead:** Lui (COO)  
**Technical Lead:** Elon (CTO)  
**Design Lead:** Lens (Media Producer)  
**Memory System:** Brains (CMO)  
**Strategy:** Warren (Strategy Chief)  
**Documentation:** Buzz (CCO)  
**User Experience:** Goldie (Marketing Chief)  
**Team Coordination:** June (Life Manager)

---

**Last Updated:** 2026-04-10  
**Version:** 1.0.0  
**Status:** 🟢 Integration Complete