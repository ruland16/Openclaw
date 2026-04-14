// Mission Control Dashboard - Frontend JavaScript
// Integrates with Elon's API and Lens's UI components

class MissionControlDashboard {
    constructor() {
        this.apiBaseUrl = window.location.origin;
        this.wsUrl = `ws://${window.location.host}`;
        this.ws = null;
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
        this.reconnectDelay = 3000;
        
        // State
        this.agents = [];
        this.tasks = [];
        this.activities = [];
        this.metrics = {};
        
        // Initialize
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.connectWebSocket();
        this.loadInitialData();
        this.startAutoRefresh();
        
        // Apply saved theme
        this.applyTheme();
    }
    
    setupEventListeners() {
        // Theme toggle
        document.getElementById('themeToggle').addEventListener('click', () => this.toggleTheme());
        
        // Navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                this.navigateTo(item.dataset.page);
            });
        });
        
        // Connection status click to reconnect
        document.getElementById('connectionStatus').addEventListener('click', () => {
            if (this.ws?.readyState !== WebSocket.OPEN) {
                this.connectWebSocket();
            }
        });
    }
    
    connectWebSocket() {
        if (this.ws) {
            this.ws.close();
        }
        
        // Add a small delay to ensure page is loaded
        setTimeout(() => {
            try {
                this.ws = new WebSocket(this.wsUrl);
                
                this.ws.onopen = () => {
                    console.log('WebSocket connected');
                    this.updateConnectionStatus(true);
                    this.reconnectAttempts = 0;
                    
                    // Subscribe to updates
                    this.ws.send(JSON.stringify({
                        type: 'subscribe',
                        channels: ['agents', 'tasks', 'activities', 'metrics']
                    }));
                };
                
                this.ws.onmessage = (event) => {
                    this.handleWebSocketMessage(JSON.parse(event.data));
                };
                
                this.ws.onclose = () => {
                    console.log('WebSocket disconnected');
                    this.updateConnectionStatus(false);
                    this.attemptReconnect();
                };
                
                this.ws.onerror = (error) => {
                    console.error('WebSocket error:', error);
                    this.updateConnectionStatus(false);
                };
                
            } catch (error) {
                console.error('Failed to connect WebSocket:', error);
                this.updateConnectionStatus(false);
                this.attemptReconnect();
            }
        }, 1000); // 1 second delay
    }
    
    attemptReconnect() {
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
            
            setTimeout(() => {
                this.connectWebSocket();
            }, this.reconnectDelay * this.reconnectAttempts);
        } else {
            console.error('Max reconnection attempts reached');
        }
    }
    
    handleWebSocketMessage(data) {
        switch (data.type) {
            case 'agent_status_updated':
                this.handleAgentStatusUpdate(data);
                break;
            case 'task_updated':
                this.handleTaskUpdate(data);
                break;
            case 'activity_logged':
                this.handleActivityLogged(data);
                break;
            case 'connection_established':
                console.log('WebSocket connection established:', data.message);
                break;
            default:
                console.log('Unhandled WebSocket message:', data);
        }
    }
    
    handleAgentStatusUpdate(data) {
        // Update agent in local state
        const agentIndex = this.agents.findIndex(a => a.id === data.agentId);
        if (agentIndex !== -1) {
            this.agents[agentIndex].status = data.status;
            this.agents[agentIndex].last_updated = data.timestamp;
            this.renderAgents();
        }
        
        // Add to activity feed
        this.addActivity({
            agent_id: data.agentId,
            activity_type: 'status_change',
            details: `Agent status changed to ${data.status}`,
            timestamp: data.timestamp
        });
        
        this.updateLastUpdated();
    }
    
    handleTaskUpdate(data) {
        // Update task in local state
        const taskIndex = this.tasks.findIndex(t => t.id === data.taskId);
        if (taskIndex !== -1) {
            this.tasks[taskIndex] = { ...this.tasks[taskIndex], ...data.updates };
        }
        
        // Add to activity feed
        this.addActivity({
            agent_id: data.updates.assigned_to || 'system',
            activity_type: 'task_updated',
            details: `Task "${data.taskId}" updated`,
            timestamp: data.timestamp
        });
        
        this.updateLastUpdated();
    }
    
    handleActivityLogged(data) {
        this.addActivity({
            agent_id: data.agentId,
            activity_type: data.activityType,
            details: data.details,
            timestamp: data.timestamp
        });
        
        this.updateLastUpdated();
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
            this.showError('Failed to load dashboard data. Please refresh the page.');
        }
    }
    
    async loadAgents() {
        try {
            const response = await fetch(`${this.apiBaseUrl}/api/agents`);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            
            const data = await response.json();
            this.agents = data.agents || [];
            
        } catch (error) {
            console.error('Failed to load agents:', error);
            // Use mock data if API fails
            this.agents = this.getMockAgents();
        }
    }
    
    async loadTasks() {
        try {
            const response = await fetch(`${this.apiBaseUrl}/api/tasks`);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            
            const data = await response.json();
            this.tasks = data.tasks || [];
            
        } catch (error) {
            console.error('Failed to load tasks:', error);
            this.tasks = [];
        }
    }
    
    async loadActivities() {
        try {
            const response = await fetch(`${this.apiBaseUrl}/api/activities?limit=20`);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            
            const data = await response.json();
            this.activities = data.activities || [];
            
        } catch (error) {
            console.error('Failed to load activities:', error);
            this.activities = [];
        }
    }
    
    async loadMetrics() {
        try {
            const response = await fetch(`${this.apiBaseUrl}/api/metrics`);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            
            const data = await response.json();
            this.metrics = data.metrics || {};
            
        } catch (error) {
            console.error('Failed to load metrics:', error);
            this.metrics = {};
        }
    }
    
    renderDashboard() {
        this.renderStats();
        this.renderAgents();
        this.renderActivities();
    }
    
    renderStats() {
        const activeAgents = this.agents.filter(a => a.status === 'active').length;
        const completedTasks = this.tasks.filter(t => t.status === 'completed').length;
        
        document.getElementById('activeAgentsCount').textContent = activeAgents;
        document.getElementById('tasksCompleted').textContent = completedTasks;
        document.getElementById('memoryUsage').textContent = '24.5 MB';
        document.getElementById('responseTime').textContent = '142ms';
        
        // Calculate changes (mock for now)
        document.getElementById('agentsChange').textContent = '+12%';
        document.getElementById('tasksChange').textContent = '+8%';
        document.getElementById('memoryChange').textContent = '+3%';
        document.getElementById('responseChange').textContent = '-5%';
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
        
        // Calculate metrics (mock for now)
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
        
        // Clear loading message
        activityFeed.innerHTML = '';
        
        // Show recent activities (limit to 10)
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
    
    addActivity(activity) {
        // Add to beginning of array
        this.activities.unshift(activity);
        
        // Keep only recent activities
        if (this.activities.length > 50) {
            this.activities = this.activities.slice(0, 50);
        }
        
        this.renderActivities();
    }
    
    updateLastUpdated() {
        const now = new Date();
        const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        document.getElementById('updateTime').textContent = timeString;
    }
    
    updateConnectionStatus(connected) {
        const statusElement = document.getElementById('connectionStatus');
        if (connected) {
            statusElement.className = 'connection-status connected';
            statusElement.innerHTML = '<i class="fas fa-circle"></i><span>Connected</span>';
        } else {
            statusElement.className = 'connection-status disconnected';
            statusElement.innerHTML = '<i class="fas fa-circle"></i><span>Disconnected</span>';
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
        
        document.getElementById('pageTitle').textContent = pageTitles[page] || page;
        
        // For now, just show overview
        // In a full implementation, this would load different views
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
            
            document.getElementById('themeToggle').innerHTML = '<i class="fas fa-sun"></i>';
            localStorage.setItem('theme', 'light');
        } else {
            // Switch to dark theme
            document.body.style.setProperty('--background-color', '#0f172a');
            document.body.style.setProperty('--surface-color', '#1e293b');
            document.body.style.setProperty('--text-color', '#f8fafc');
            document.body.style.setProperty('--text-secondary', '#94a3b8');
            
            document.getElementById('themeToggle').innerHTML = '<i class="fas fa-moon"></i>';
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
            document.getElementById('themeToggle').innerHTML = '<i class="fas fa-sun"></i>';
        } else {
            document.body.style.setProperty('--background-color', '#0f172a');
            document.body.style.setProperty('--surface-color', '#1e293b');
            document.body.style.setProperty('--text-color', '#f8fafc');
            document.body.style.setProperty('--text-secondary', '#94a3b8');
            document.getElementById('themeToggle').innerHTML = '<i class="fas fa-moon"></i>';
        }
    }
    
    startAutoRefresh() {
        // Refresh data every 30 seconds
        setInterval(() => {
            this.loadInitialData();
        }, 30000);
    }
    
    showError(message) {
        // Simple error notification
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background-color: var(--danger-color);
            color: white;
            padding: 15px 20px;
            border-radius: 5px;
            z-index: 1000;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        `;
        errorDiv.textContent = message;
        
        document.body.appendChild(errorDiv);
        
        setTimeout(() => {
            errorDiv.remove();
        }, 5000);
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
    
    getMockAgents() {
        return [
            {
                id: '1',
                name: 'Lui',
                role: 'COO / Orchestrator',
                status: 'active',
                model: 'deepseek/deepseek-chat',
                created_at: new Date().toISOString(),
                last_updated: new Date().toISOString()
            },
            {
                id: '2',
                name: 'Warren',
                role: 'Strategy Chief',
                status: 'active',
                model: 'deepseek/deepseek-chat',
                created_at: new Date().toISOString(),
                last_updated: new Date().toISOString()
            },
            {
                id: '3',
                name: 'Elon',
                role: 'CTO',
                status: 'active',
                model: 'deepseek/deepseek-chat',
                created_at: new Date().toISOString(),
                last_updated: new Date().toISOString()
            },
            {
                id: '4',
                name: 'Brains',
                role: 'CMO',
                status: 'active',
                model: 'deepseek/deepseek-chat',
                created_at: new Date().toISOString(),
                last_updated: new Date().toISOString()
            },
            {
                id: '5',
                name: 'Lens',
                role: 'Media Producer',
                status: 'active',
                model: 'deepseek/deepseek-chat',
                created_at: new Date().toISOString(),
                last_updated: new Date().toISOString()
            },
            {
                id: '6',
                name: 'Buzz',
                role: 'CCO',
                status: 'active',
                model: 'deepseek/deepseek-chat',
                created_at: new Date().toISOString(),
                last_updated: new Date().toISOString()
            },
            {
                id: '7',
                name: 'Goldie',
                role: 'Marketing Chief',
                status: 'active',
                model: 'deepseek/deepseek-chat',
                created_at: new Date().toISOString(),
                last_updated: new Date().toISOString()
            },
            {
                id: '8',
                name: 'June',
                role: 'Life Manager',
                status: 'active',
                model: 'deepseek/deepseek-chat',
                created_at: new Date().toISOString(),
                last_updated: new Date().toISOString()
            }
        ];
    }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.dashboard = new MissionControlDashboard();
});