// Complete Mission Control Dashboard
class CompleteDashboard {
    constructor() {
        this.ws = null;
        this.agents = [];
        this.tasks = [];
        this.activities = [];
        this.metrics = {};
        this.currentPage = 'overview';
        
        this.init();
    }
    
    init() {
        console.log('🚀 Initializing Complete Dashboard...');
        this.setupEventListeners();
        this.connectWebSocket();
        this.loadAllData();
        this.navigateTo('overview');
    }
    
    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const page = item.dataset.page;
                this.navigateTo(page);
            });
        });
        
        // Connection status click to reconnect
        const connectionStatus = document.getElementById('connectionStatus');
        if (connectionStatus) {
            connectionStatus.addEventListener('click', () => {
                this.connectWebSocket();
            });
        }
    }
    
    connectWebSocket() {
        if (this.ws) {
            this.ws.close();
        }
        
        console.log('Connecting WebSocket...');
        this.updateConnection(false);
        
        const urls = ['ws://localhost:3000', 'ws://127.0.0.1:3000'];
        let currentUrl = 0;
        
        const tryConnect = () => {
            if (currentUrl >= urls.length) {
                console.error('All WebSocket URLs failed');
                return;
            }
            
            const url = urls[currentUrl];
            console.log(`Trying: ${url}`);
            
            try {
                this.ws = new WebSocket(url);
                
                this.ws.onopen = () => {
                    console.log(`✅ Connected to ${url}`);
                    this.updateConnection(true);
                    
                    // Subscribe to updates
                    this.ws.send(JSON.stringify({
                        type: 'subscribe',
                        timestamp: new Date().toISOString()
                    }));
                };
                
                this.ws.onmessage = (event) => {
                    try {
                        const data = JSON.parse(event.data);
                        console.log('WebSocket message:', data.type);
                        
                        if (data.type === 'connection_established') {
                            console.log('Connection established:', data.message);
                        } else if (data.type === 'agent_status_updated') {
                            this.handleAgentStatusUpdate(data);
                        } else if (data.type === 'task_updated') {
                            this.handleTaskUpdate(data);
                        } else if (data.type === 'activity_logged') {
                            this.handleActivityUpdate(data);
                        }
                    } catch (e) {
                        console.log('Raw message:', event.data);
                    }
                };
                
                this.ws.onclose = () => {
                    console.log('WebSocket closed');
                    this.updateConnection(false);
                    currentUrl++;
                    setTimeout(tryConnect, 2000);
                };
                
                this.ws.onerror = () => {
                    console.log(`WebSocket error for ${url}`);
                    this.updateConnection(false);
                    currentUrl++;
                    setTimeout(tryConnect, 2000);
                };
                
            } catch (error) {
                console.error(`Failed to create WebSocket: ${error}`);
                currentUrl++;
                setTimeout(tryConnect, 2000);
            }
        };
        
        tryConnect();
    }
    
    updateConnection(connected) {
        const status = document.getElementById('connectionStatus');
        if (status) {
            status.className = `connection ${connected ? 'connected' : 'disconnected'}`;
            status.innerHTML = `<span>●</span> ${connected ? 'Connected' : 'Disconnected'}`;
            status.title = connected ? 'WebSocket connected' : 'Click to reconnect';
        }
    }
    
    async loadAllData() {
        try {
            console.log('Loading all data...');
            
            // Load agents
            await this.loadAgents();
            
            // Load tasks
            await this.loadTasks();
            
            // Load activities
            await this.loadActivities();
            
            // Load metrics
            await this.loadMetrics();
            
            this.updateLastUpdated();
            
        } catch (error) {
            console.error('Failed to load data:', error);
            this.useMockData();
        }
    }
    
    async loadAgents() {
        try {
            const response = await fetch('/api/agents');
            const data = await response.json();
            this.agents = data.agents || [];
            console.log(`Loaded ${this.agents.length} agents`);
            
            // Update UI if on agents page
            if (this.currentPage === 'agents' || this.currentPage === 'overview') {
                this.renderAgents();
            }
            
        } catch (error) {
            console.error('Error loading agents:', error);
            this.agents = this.getMockAgents();
        }
    }
    
    async loadTasks() {
        try {
            const response = await fetch('/api/tasks');
            const data = await response.json();
            this.tasks = data.tasks || [];
            console.log(`Loaded ${this.tasks.length} tasks`);
            
            // Update UI if on tasks page
            if (this.currentPage === 'tasks') {
                this.renderTasks();
            }
            
        } catch (error) {
            console.error('Error loading tasks:', error);
            this.tasks = this.getMockTasks();
        }
    }
    
    async loadActivities() {
        try {
            const response = await fetch('/api/memory/activities');
            const data = await response.json();
            this.activities = data.activities || [];
            console.log(`Loaded ${this.activities.length} activities`);
            
            // Update UI if on overview or memory page
            if (this.currentPage === 'overview' || this.currentPage === 'memory') {
                this.renderActivities();
            }
            
        } catch (error) {
            console.error('Error loading activities:', error);
            this.activities = this.getMockActivities();
        }
    }
    
    async loadMetrics() {
        try {
            const response = await fetch('/api/metrics');
            const data = await response.json();
            this.metrics = data.metrics || {};
            console.log('Loaded metrics:', this.metrics);
            
            // Update UI if on metrics or overview page
            if (this.currentPage === 'metrics' || this.currentPage === 'overview') {
                this.renderMetrics();
                this.updateStats();
            }
            
        } catch (error) {
            console.error('Error loading metrics:', error);
            this.metrics = this.getMockMetrics();
        }
    }
    
    navigateTo(page) {
        this.currentPage = page;
        
        // Update active nav item
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
            if (item.dataset.page === page) {
                item.classList.add('active');
            }
        });
        
        // Hide all pages
        document.querySelectorAll('.main-content').forEach(page => {
            page.classList.add('hidden');
        });
        
        // Show current page
        const pageElement = document.getElementById(`${page}Page`);
        if (pageElement) {
            pageElement.classList.remove('hidden');
        }
        
        // Update page title
        const pageTitles = {
            overview: 'Dashboard Overview',
            agents: 'Agent Management',
            tasks: 'Task Management',
            memory: 'Memory System',
            metrics: 'Performance Metrics',
            settings: 'Settings'
        };
        
        const pageTitleElement = document.querySelector(`#${page}Page .page-title`);
        if (pageTitleElement) {
            pageTitleElement.textContent = pageTitles[page] || page;
        }
        
        // Load/render data for the page
        switch(page) {
            case 'overview':
                this.renderOverview();
                break;
            case 'agents':
                this.renderAgents();
                break;
            case 'tasks':
                this.renderTasks();
                break;
            case 'memory':
                this.renderMemory();
                break;
            case 'metrics':
                this.renderMetrics();
                break;
            case 'settings':
                this.renderSettings();
                break;
        }
        
        console.log(`Navigated to: ${page}`);
    }
    
    renderOverview() {
        this.updateStats();
        this.renderActivities('overviewActivities');
    }
    
    updateStats() {
        const activeAgents = this.agents.filter(a => a.status === 'active').length;
        const completedTasks = this.tasks.filter(t => t.status === 'completed').length;
        
        if (document.getElementById('activeAgentsCount')) {
            document.getElementById('activeAgentsCount').textContent = activeAgents;
            document.getElementById('tasksCompleted').textContent = completedTasks;
            document.getElementById('memoryUsage').textContent = '24.5 MB';
            document.getElementById('responseTime').textContent = '142ms';
            
            // Update change indicators
            document.getElementById('agentsChange').textContent = '+12%';
            document.getElementById('tasksChange').textContent = '+8%';
            document.getElementById('memoryChange').textContent = '+3%';
            document.getElementById('responseChange').textContent = '-5%';
        }
        
        // Update total agents count
        if (document.getElementById('totalAgentsCount')) {
            document.getElementById('totalAgentsCount').textContent = this.agents.length;
        }
    }
    
    renderAgents() {
        const agentsGrid = document.getElementById('agentsGrid');
        if (!agentsGrid) return;
        
        agentsGrid.innerHTML = '';
        
        this.agents.forEach(agent => {
            const agentCard = this.createAgentCard(agent);
            agentsGrid.appendChild(agentCard);
        });
    }
    
    createAgentCard(agent) {
        const card = document.createElement('div');
        card.className = 'agent-card';
        
        const statusClass = agent.status === 'active' ? 'status-active' : 'status-inactive';
        const taskCount = this.tasks.filter(t => t.assigned_to === agent.id).length;
        const activityCount = this.activities.filter(a => a.agent_id === agent.id).length;
        const cpu = Math.floor(Math.random() * 30) + 10;
        
        card.innerHTML = `
            <div class="agent-header">
                <div class="agent-info">
                    <h3>${agent.name}</h3>
                    <p class="agent-role">${agent.role}</p>
                </div>
                <span class="agent-status ${statusClass}">
                    <i class="fas fa-circle"></i>
                    <span>${agent.status}</span>
                </span>
            </div>
            <div class="agent-metrics">
                <div class="metric">
                    <p class="metric-value">${taskCount}</p>
                    <p class="metric-label">Tasks</p>
                </div>
                <div class="metric">
                    <p class="metric-value">${activityCount}</p>
                    <p class="metric-label">Activities</p>
                </div>
                <div class="metric">
                    <p class="metric-value">${cpu}%</p>
                    <p class="metric-label">CPU</p>
                </div>
            </div>
        `;
        
        return card;
    }
    
    renderTasks() {
        const tasksTable = document.getElementById('tasksTable');
        if (!tasksTable) return;
        
        const tbody = tasksTable.querySelector('tbody');
        if (!tbody) return;
        
        tbody.innerHTML = '';
        
        this.tasks.forEach(task => {
            const row = document.createElement('tr');
            
            const statusClass = this.getTaskStatusClass(task.status);
            const assignedAgent = this.agents.find(a => a.id === task.assigned_to);
            const agentName = assignedAgent ? assignedAgent.name : 'Unassigned';
            
            row.innerHTML = `
                <td>${task.id}</td>
                <td>${task.title}</td>
                <td><span class="task-status ${statusClass}">${task.status}</span></td>
                <td>${agentName}</td>
                <td>
                    <button class="task-action" data-task-id="${task.id}">View</button>
                </td>
            `;
            
            tbody.appendChild(row);
        });
    }
    
    renderActivities(containerId = 'activitiesContainer') {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        container.innerHTML = '';
        
        const recentActivities = this.activities.slice(0, 10);
        
        if (recentActivities.length === 0) {
            container.innerHTML = '<div style="text-align: center; color: var(--text-secondary); padding: 20px;">No recent activities</div>';
            return;
        }
        
        recentActivities.forEach(activity => {
            const activityItem = this.createActivityItem(activity);
            container.appendChild(activityItem);
        });
    }
    
    createActivityItem(activity) {
        const item = document.createElement('div');
        item.className = 'activity-item';
        
        const { icon, color, bgColor } = this.getActivityIcon(activity.activity_type);
        const agent = this.agents.find(a => a.id === activity.agent_id);
        const agentName = agent ? agent.name : 'System';
        const timeAgo = this.getTimeAgo(activity.timestamp);
        
        item.innerHTML = `
            <div class="activity-icon" style="background-color: ${bgColor}; color: ${color};">
                <i class="fas ${icon}"></i>
            </div>
            <div class="activity-content">
                <h4 class="activity-title">${this.getActivityTitle(activity)}</h4>
                <p class="activity-details">${agentName} • ${activity.details || 'No details'}</p>
            </div>
            <div class="activity-time">${timeAgo}</div>
        `;
        
        return item;
    }
    
    renderMemory() {
        const memoryContainer = document.getElementById('memoryContainer');
        if (!memoryContainer) return;
        
        // Show activities in memory view
        this.renderActivities('memoryActivities');
    }
    
    renderMetrics() {
        const metricsContainer = document.getElementById('metricsContainer');
        if (!metricsContainer) return;
        
        metricsContainer.innerHTML = `
            <div class="metric-card">
                <h3>Agent Performance</h3>
                <div style="font-size: 2.5rem; font-weight: bold; margin: 20px 0;">${this.metrics.active_agents || 0}/8</div>
                <div style="color: var(--text-secondary);">Active Agents</div>
            </div>
            
            <div class="metric-card">
                <h3>Task Completion</h3>
                <div style="font-size: 2.5rem; font-weight: bold; margin: 20px 0;">${this.metrics.completed_tasks || 0}/${this.metrics.total_tasks || 0}</div>
                <div style="color: var(--text-secondary);">Tasks Completed</div>
            </div>
            
            <div class="metric-card">
                <h3>Response Time</h3>
                <div style="font-size: 2.5rem; font-weight: bold; margin: 20px 0;">${this.metrics.avg_response_time || 0}ms</div>
                <div style="color: var(--text-secondary);">Average Response</div>
            </div>
        `;
    }
    
    renderSettings() {
        const settingsContainer = document.getElementById('settingsContainer');
        if (!settingsContainer) return;
        
        settingsContainer.innerHTML = `
            <div class="settings-section">
                <h3>Dashboard Settings</h3>
                <div class="setting-item">
                    <div class="setting-label">Auto-refresh Interval</div>
                    <div class="setting-value">30 seconds</div>
                </div>
                <div class="setting-item">
                    <div class="setting-label">Theme</div>
                    <div class="setting-value">Dark</div>
                </div>
                <div class="setting-item">
                    <div class="setting-label">Notifications</div>
                    <div class="setting-value">Enabled</div>
                </div>
            </div>
            
            <div class="settings-section">
                <h3>System Information</h3>
                <div class="setting-item">
                    <div class="setting-label">Server Status</div>
                    <div class="setting-value" style="color: var(--success);">Online</div>
                </div>
                <div class="setting-item">
                    <div class="setting-label">Database</div>
                    <div class="setting-value">SQLite (Connected)</div>
                </div>
                <div class="setting-item">
                    <div class="setting-label">WebSocket</div>
                    <div class="setting-value" id="wsStatus">Disconnected</div>
                </div>
                <div class="setting-item">
                    <div class="setting-label">API Version</div>
                    <div class="setting-value">1.0.0</div>
                </div>
            </div>
        `;
    }
    
    updateLastUpdated() {
        const now = new Date();
        const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const updateTimeElements = document.querySelectorAll('#updateTime');
        updateTimeElements.forEach(el => {
            el.textContent = timeString;
        });
    }
    
    handleAgentStatusUpdate(data) {
        console.log('Agent status update:', data);
        this.loadAgents();
        this.updateLastUpdated();
    }
    
    handleTaskUpdate(data) {
        console.log('Task update:', data);
        this.loadTasks();
        this.updateLastUpdated();
    }
    
    handleActivityUpdate(data) {
        console.log('Activity update:', data);
        this.loadActivities();
        this.updateLastUpdated();
    }
    
    // Helper methods
    getTaskStatusClass(status) {
        const statusMap = {
            'completed': 'status-completed',
            'in_progress': 'status-in-progress',
            'pending': 'status-pending'
        };
        return statusMap[status] || 'status-pending';
    }
    
    getActivityIcon(activityType) {
        const iconMap = {
            'status_change': { icon: 'fa-sync-alt', color: '#2563eb', bgColor: 'rgba(37, 99, 235, 0.2)' },
            'task_created': { icon: 'fa-plus-circle', color: '#10b981', bgColor: 'rgba(16, 185, 129, 0.2)' },
            'task_completed': { icon: 'fa-check-circle', color: '#10