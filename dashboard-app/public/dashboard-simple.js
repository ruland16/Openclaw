// Mission Control Dashboard - Simple Frontend
class SimpleDashboard {
    constructor() {
        this.apiBaseUrl = window.location.origin;
        this.wsUrl = `ws://${window.location.host}`;
        this.ws = null;
        
        this.agents = [];
        this.tasks = [];
        this.activities = [];
        this.metrics = {};
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.loadInitialData();
        this.connectWebSocket();
        this.applyTheme();
    }
    
    setupEventListeners() {
        // Theme toggle
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }
        
        // Navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                this.navigateTo(item.dataset.page);
            });
        });
    }
    
    connectWebSocket() {
        if (this.ws) {
            this.ws.close();
        }
        
        console.log('Connecting to WebSocket...');
        this.updateConnectionStatus(false);
        
        // Try multiple WebSocket URLs
        const wsUrls = [
            `ws://${window.location.hostname}:3000`,
            `ws://localhost:3000`,
            `ws://127.0.0.1:3000`,
            this.wsUrl
        ];
        
        let currentUrlIndex = 0;
        
        const tryConnect = () => {
            if (currentUrlIndex >= wsUrls.length) {
                console.error('All WebSocket URLs failed');
                return;
            }
            
            const url = wsUrls[currentUrlIndex];
            console.log(`Trying WebSocket URL: ${url}`);
            
            try {
                this.ws = new WebSocket(url);
                
                this.ws.onopen = () => {
                    console.log(`WebSocket connected to ${url}`);
                    this.updateConnectionStatus(true);
                    
                    // Send ping to test connection
                    this.ws.send(JSON.stringify({
                        type: 'ping',
                        timestamp: new Date().toISOString()
                    }));
                };
            
            this.ws.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    console.log('WebSocket message:', data.type);
                    
                    if (data.type === 'connection_established') {
                        console.log('Connection established:', data.message);
                    } else if (data.type === 'pong') {
                        console.log('Pong received');
                    } else if (data.type === 'agent_status_updated') {
                        this.handleAgentStatusUpdate(data);
                    }
                } catch (error) {
                    console.error('Error parsing WebSocket message:', error);
                }
            };
            
            this.ws.onclose = () => {
                console.log('WebSocket disconnected');
                this.updateConnectionStatus(false);
                // Try to reconnect after 5 seconds
                setTimeout(() => this.connectWebSocket(), 5000);
            };
            
            this.ws.onerror = (error) => {
                console.error('WebSocket error:', error);
                this.updateConnectionStatus(false);
            };
            
        } catch (error) {
            console.error('Failed to create WebSocket:', error);
            this.updateConnectionStatus(false);
        }
    }
    
    updateConnectionStatus(connected) {
        const statusElement = document.getElementById('connectionStatus');
        if (statusElement) {
            if (connected) {
                statusElement.className = 'connection-status connected';
                statusElement.innerHTML = '<i class="fas fa-circle"></i><span>Connected</span>';
            } else {
                statusElement.className = 'connection-status disconnected';
                statusElement.innerHTML = '<i class="fas fa-circle"></i><span>Disconnected</span>';
            }
        }
    }
    
    async loadInitialData() {
        try {
            await Promise.all([
                this.loadAgents(),
                this.loadTasks(),
                this.loadActivities(),
                this.loadMetrics()
            ]);
            
            this.renderDashboard();
            this.updateLastUpdated();
            
        } catch (error) {
            console.error('Failed to load initial data:', error);
            // Use mock data
            this.useMockData();
            this.renderDashboard();
        }
    }
    
    async loadAgents() {
        try {
            const response = await fetch(`${this.apiBaseUrl}/api/agents`);
            const data = await response.json();
            this.agents = data.agents || [];
        } catch (error) {
            console.error('Error loading agents:', error);
            throw error;
        }
    }
    
    async loadTasks() {
        try {
            const response = await fetch(`${this.apiBaseUrl}/api/tasks`);
            const data = await response.json();
            this.tasks = data.tasks || [];
        } catch (error) {
            console.error('Error loading tasks:', error);
            throw error;
        }
    }
    
    async loadActivities() {
        try {
            const response = await fetch(`${this.apiBaseUrl}/api/memory/activities`);
            const data = await response.json();
            this.activities = data.activities || [];
        } catch (error) {
            console.error('Error loading activities:', error);
            throw error;
        }
    }
    
    async loadMetrics() {
        try {
            const response = await fetch(`${this.apiBaseUrl}/api/metrics`);
            const data = await response.json();
            this.metrics = data.metrics || {};
        } catch (error) {
            console.error('Error loading metrics:', error);
            throw error;
        }
    }
    
    useMockData() {
        this.agents = [
            { id: '1', name: 'Lui', role: 'COO / Orchestrator', status: 'active' },
            { id: '2', name: 'Warren', role: 'Strategy Chief', status: 'active' },
            { id: '3', name: 'Elon', role: 'CTO', status: 'active' },
            { id: '4', name: 'Brains', role: 'CMO', status: 'active' },
            { id: '5', name: 'Lens', role: 'Media Producer', status: 'active' },
            { id: '6', name: 'Buzz', role: 'CCO', status: 'active' },
            { id: '7', name: 'Goldie', role: 'Marketing Chief', status: 'active' },
            { id: '8', name: 'June', role: 'Life Manager', status: 'active' }
        ];
        
        this.tasks = [
            { id: '1', title: 'Research mission control patterns', status: 'completed', assigned_to: '2' },
            { id: '2', title: 'Build dashboard backend', status: 'in_progress', assigned_to: '3' },
            { id: '3', title: 'Design UI components', status: 'in_progress', assigned_to: '5' }
        ];
        
        this.activities = [
            { agent_id: '1', activity_type: 'status_change', details: 'Dashboard started', timestamp: new Date().toISOString() },
            { agent_id: '2', activity_type: 'task_completed', details: 'Research completed', timestamp: new Date(Date.now() - 300000).toISOString() },
            { agent_id: '3', activity_type: 'task_completed', details: 'Backend built', timestamp: new Date(Date.now() - 600000).toISOString() }
        ];
        
        this.metrics = {
            active_agents: 8,
            total_tasks: 15,
            completed_tasks: 12,
            avg_response_time: 142
        };
    }
    
    renderDashboard() {
        this.renderStats();
        this.renderAgents();
        this.renderActivities();
    }
    
    renderStats() {
        const activeAgents = this.agents.filter(a => a.status === 'active').length;
        const completedTasks = this.tasks.filter(t => t.status === 'completed').length;
        
        if (document.getElementById('activeAgentsCount')) {
            document.getElementById('activeAgentsCount').textContent = activeAgents;
            document.getElementById('tasksCompleted').textContent = completedTasks;
            document.getElementById('memoryUsage').textContent = '24.5 MB';
            document.getElementById('responseTime').textContent = '142ms';
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
        
        const statusClass = this.getStatusClass(agent.status);
        const statusIcon = this.getStatusIcon(agent.status);
        
        const taskCount = this.tasks.filter(t => t.assigned_to === agent.id).length;
        const activityCount = this.activities.filter(a => a.agent_id === agent.id).length;
        
        card.innerHTML = `
            <div class="agent-header">
                <div>
                    <h3 class="agent-name">${agent.name}</h3>
                    <p class="agent-role">${agent.role}</p>
                </div>
                <span class="agent-status ${statusClass}">
                    <i class="fas ${statusIcon}"></i>
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
                    <p class="metric-value">${this.getRandomCpuUsage()}%</p>
                    <p class="metric-label">CPU</p>
                </div>
            </div>
        `;
        
        return card;
    }
    
    renderActivities() {
        const activityFeed = document.getElementById('activityFeed');
        if (!activityFeed) return;
        
        activityFeed.innerHTML = '';
        
        const recentActivities = this.activities.slice(0, 10);
        
        if (recentActivities.length === 0) {
            activityFeed.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">No recent activities</p>';
            return;
        }
        
        recentActivities.forEach(activity => {
            const activityItem = this.createActivityItem(activity);
            activityFeed.appendChild(activityItem);
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
    
    handleAgentStatusUpdate(data) {
        console.log('Agent status update:', data);
        // Update UI if needed
        this.updateLastUpdated();
    }
    
    updateLastUpdated() {
        const now = new Date();
        const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const updateTimeElement = document.getElementById('updateTime');
        if (updateTimeElement) {
            updateTimeElement.textContent = timeString;
        }
    }
    
    navigateTo(page) {
        // Update active nav item
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
            if (item.dataset.page === page) {
                item.classList.add('active');
            }
        });
        
        // Update page title
        const pageTitles = {
            overview: 'Dashboard Overview',
            agents: 'Agent Management',
            tasks: 'Task Management',
            memory: 'Memory System',
            metrics: 'Performance Metrics',
            activities: 'Activity Feed',
            alerts: 'System Alerts',
            settings: 'Settings',
            api: 'API Documentation'
        };
        
        const pageTitleElement = document.getElementById('pageTitle');
        if (pageTitleElement) {
            pageTitleElement.textContent = pageTitles[page] || page;
        }
        
        console.log(`Navigated to: ${page}`);
    }
    
    toggleTheme() {
        const isDark = document.body.style.getPropertyValue('--background-color') === '#0f172a';
        
        if (isDark) {
            // Switch to light theme
            document.body.style.setProperty('--background-color', '#f8fafc');
            document.body.style.setProperty('--surface-color', '#ffffff');
            document.body.style.setProperty('--text-color', '#0f172a');
            document.body.style.setProperty('--text-secondary', '#64748b');
            
            const themeToggle = document.getElementById('themeToggle');
            if (themeToggle) {
                themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
            }
            localStorage.setItem('theme', 'light');
        } else {
            // Switch to dark theme
            document.body.style.setProperty('--background-color', '#0f172a');
            document.body.style.setProperty('--surface-color', '#1e293b');
            document.body.style.setProperty('--text-color', '#f8fafc');
            document.body.style.setProperty('--text-secondary', '#94a3b8');
            
            const themeToggle = document.getElementById('themeToggle');
            if (themeToggle) {
                themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
            }
            localStorage.setItem('theme', 'dark');
        }
    }
    
    applyTheme() {
        const savedTheme = localStorage.getItem('theme') || 'dark';
        
        if (savedTheme === 'light') {
            document.body.style.setProperty('--background-color', '#f8fafc');
            document.body.style.setProperty('--surface-color', '#ffffff');
            document.body.style.setProperty('--text-color', '#0f172a');
            document.body.style.setProperty('--text-secondary', '#64748b');
            const themeToggle = document.getElementById('themeToggle');
            if (themeToggle) {
                themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
            }
        } else {
            document.body.style.setProperty('--background-color', '#0f172a');
            document.body.style.setProperty('--surface-color', '#1e293b');
            document.body.style.setProperty('--text-color', '#f8fafc');
            document.body.style.setProperty('--text-secondary', '#94a3b8');
            const themeToggle = document.getElementById('themeToggle');
            if (themeToggle) {
                themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
            }
        }
    }
    
    // Helper methods
    getStatusClass(status) {
        const statusMap = {
            'active': 'status-active',
            'inactive': 'status-inactive',
            'warning': 'status-warning',
            'error': 'status-error',
            'busy': 'status-warning'
        };
        return statusMap[status] || 'status-inactive';
    }
    
    getStatusIcon(status) {
        const iconMap = {
            'active': 'fa-play-circle',
            'inactive': 'fa-stop-circle',
            'warning': 'fa-exclamation-circle',
            'error': 'fa-times-circle',
            'busy': 'fa-sync-alt'
        };
        return iconMap[status] || 'fa-question-circle';
    }
    
    getActivityIcon(activityType) {
        const iconMap = {
            'status_change': { icon: 'fa-sync-alt', color: '#2563eb', bgColor: 'rgba(37, 99, 235, 0.2)' },
            'task_created': { icon: 'fa-plus-circle', color: '#10b981', bgColor: 'rgba(16, 185, 129, 0.2)' },
            'task_completed': { icon: 'fa-check-circle', color: '#10b981', bgColor: 'rgba(16, 185, 129, 0.2)' },
            'task_updated': { icon: 'fa-edit', color: '#f59e0b', bgColor: 'rgba(245, 158, 11, 0.2)' },
            'agent_created': { icon: 'fa-robot', color: '#7c3aed', bgColor: 'rgba(124, 58, 237, 0.2)' },
            'config_updated': { icon: 'fa-cog', color: '#8b5cf6', bgColor: 'rgba(139, 92, 246, 0.2)' },
            'memory_logged': { icon: 'fa-brain', color: '#ec4899', bgColor: 'rgba(236, 72, 153, 0.2)' },
            'error': { icon: 'fa-exclamation-triangle', color: '#ef4444', bgColor: 'rgba(239, 68, 68, 0.2)' },
            'info': { icon: 'fa-info-circle', color: '#6b7280', bgColor: 'rgba(107, 114, 128, 0.2)' }
        };
        
        return iconMap[activityType] || { icon: 'fa-info-circle', color: '#6b7280', bgColor: 'rgba(107, 114, 128, 0.2)' };
    }
    
    getActivityTitle(activity) {
        const titleMap = {
            'status_change': 'Status Changed',
            'task_created': 'Task Created',
            'task_completed': 'Task Completed',
            'task_updated': 'Task Updated',
            'agent_created': 'Agent Created',
            'config_updated': 'Configuration Updated',
            'memory_logged': 'Memory Logged',
            'error': 'Error Occurred',
            'info': 'Information'
        };
        
        return titleMap[activity.activity_type] || activity.activity_type;
    }
    
    getTimeAgo(timestamp) {
        const now = new Date();
        const past = new Date(timestamp);
        const diffMs = now - past;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);
        
        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        return `${diffDays}d ago`;
    }
    
    getRandomCpuUsage() {
        return Math.floor(Math.random() * 30) + 10; // 10-40%
    }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.dashboard = new SimpleDashboard();
});