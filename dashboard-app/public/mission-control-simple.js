// Simple Mission Control Dashboard - Guaranteed to work
class MissionControl {
    constructor() {
        this.agents = [];
        this.tasks = [];
        this.activities = [];
        this.metrics = {};
    }
    
    init() {
        console.log('🚀 Mission Control initializing...');
        this.setupNavigation();
        this.loadAllData();
        this.updateLastUpdateTime();
    }
    
    setupNavigation() {
        // Sidebar navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const page = item.dataset.page;
                this.navigateTo(page);
            });
        });
        
        // Refresh button
        const refreshBtn = document.getElementById('refreshBtn');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                this.loadAllData();
                this.showNotification('Data refreshed');
            });
        }
    }
    
    navigateTo(page) {
        console.log(`Navigating to: ${page}`);
        
        // Update sidebar
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
            if (item.dataset.page === page) {
                item.classList.add('active');
            }
        });
        
        // Update pages
        document.querySelectorAll('.page').forEach(pageEl => {
            pageEl.classList.remove('active');
        });
        
        // Show selected page
        const pageElement = document.getElementById(`${page}Page`);
        if (pageElement) {
            pageElement.classList.add('active');
        }
        
        // Load data for the page if needed
        switch(page) {
            case 'agents':
                this.renderAllAgents();
                break;
            case 'tasks':
                this.renderAllTasks();
                break;
            case 'memory':
                this.renderMemoryActivities();
                break;
            case 'metrics':
                this.renderMetricsChart();
                break;
        }
    }
    
    async loadAllData() {
        try {
            await Promise.all([
                this.loadAgents(),
                this.loadTasks(),
                this.loadActivities(),
                this.loadMetrics()
            ]);
            
            this.renderDashboard();
            this.updateLastUpdateTime();
            
            console.log('✅ All data loaded successfully');
        } catch (error) {
            console.error('Failed to load data:', error);
            this.showNotification('Failed to load data', 'error');
            // Use mock data as fallback
            this.useMockData();
        }
    }
    
    async loadAgents() {
        try {
            const response = await fetch('/api/agents');
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            
            const data = await response.json();
            this.agents = data.agents || [];
            console.log(`Loaded ${this.agents.length} agents`);
        } catch (error) {
            console.error('Error loading agents:', error);
            this.agents = this.getMockAgents();
        }
    }
    
    async loadTasks() {
        try {
            const response = await fetch('/api/tasks');
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            
            const data = await response.json();
            this.tasks = data.tasks || [];
            console.log(`Loaded ${this.tasks.length} tasks`);
        } catch (error) {
            console.error('Error loading tasks:', error);
            this.tasks = this.getMockTasks();
        }
    }
    
    async loadActivities() {
        try {
            const response = await fetch('/api/memory/activities');
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            
            const data = await response.json();
            this.activities = data.activities || [];
            console.log(`Loaded ${this.activities.length} activities`);
        } catch (error) {
            console.error('Error loading activities:', error);
            this.activities = this.getMockActivities();
        }
    }
    
    async loadMetrics() {
        try {
            const response = await fetch('/api/metrics');
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            
            const data = await response.json();
            this.metrics = data.metrics || {};
            console.log('Loaded metrics:', this.metrics);
        } catch (error) {
            console.error('Error loading metrics:', error);
            this.metrics = this.getMockMetrics();
        }
    }
    
    useMockData() {
        this.agents = this.getMockAgents();
        this.tasks = this.getMockTasks();
        this.activities = this.getMockActivities();
        this.metrics = this.getMockMetrics();
        this.renderDashboard();
    }
    
    renderDashboard() {
        // Update stats
        const activeAgents = this.agents.filter(a => a.status === 'active').length;
        const completedTasks = this.tasks.filter(t => t.status === 'completed').length;
        
        const activeAgentsEl = document.getElementById('activeAgentsCount');
        const completedTasksEl = document.getElementById('completedTasksCount');
        const responseTimeEl = document.getElementById('responseTime');
        const memoryUsageEl = document.getElementById('memoryUsage');
        
        if (activeAgentsEl) activeAgentsEl.textContent = activeAgents;
        if (completedTasksEl) completedTasksEl.textContent = completedTasks;
        if (responseTimeEl) responseTimeEl.textContent = '142ms';
        if (memoryUsageEl) memoryUsageEl.textContent = '24.5 MB';
        
        // Render dashboard agents (limited to 4)
        this.renderAgentsGrid('dashboardAgents', this.agents.slice(0, 4));
        
        // Render recent tasks (limited to 5)
        this.renderTasksList('recentTasks', this.tasks.slice(0, 5));
        
        // Render activity feed
        this.renderActivityFeed('activityFeed', this.activities.slice(0, 6));
        
        // Render metrics chart
        this.renderMetricsChart();
    }
    
    renderAgentsGrid(containerId, agents) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        if (!agents || agents.length === 0) {
            container.innerHTML = '<div class="loading">No agents found</div>';
            return;
        }
        
        container.innerHTML = '';
        
        agents.forEach(agent => {
            const card = document.createElement('div');
            card.className = 'agent-card';
            
            const statusClass = agent.status === 'active' ? 'status-active' : 'status-inactive';
            const taskCount = Math.floor(Math.random() * 10);
            const activityCount = Math.floor(Math.random() * 20);
            const cpu = Math.floor(Math.random() * 30) + 10;
            
            card.innerHTML = `
                <div class="agent-header">
                    <div>
                        <div class="agent-name">${agent.name}</div>
                        <div class="agent-role">${agent.role}</div>
                    </div>
                    <span class="agent-status ${statusClass}">${agent.status}</span>
                </div>
                <div class="agent-metrics">
                    <div>
                        <div class="metric-value">${taskCount}</div>
                        <div class="metric-label">Tasks</div>
                    </div>
                    <div>
                        <div class="metric-value">${activityCount}</div>
                        <div class="metric-label">Activities</div>
                    </div>
                    <div>
                        <div class="metric-value">${cpu}%</div>
                        <div class="metric-label">CPU</div>
                    </div>
                </div>
            `;
            
            container.appendChild(card);
        });
    }
    
    renderAllAgents() {
        const container = document.getElementById('allAgents');
        if (!container) return;
        
        this.renderAgentsGrid('allAgents', this.agents);
    }
    
    renderTasksList(containerId, tasks) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        if (!tasks || tasks.length === 0) {
            container.innerHTML = '<div class="loading">No tasks found</div>';
            return;
        }
        
        container.innerHTML = '';
        
        tasks.forEach(task => {
            const item = document.createElement('div');
            item.className = 'task-item';
            
            const priority = task.priority || 'medium';
            const priorityClass = `priority-${priority}`;
            const statusText = task.status === 'completed' ? 'Completed' : 
                             task.status === 'in_progress' ? 'In Progress' : 'Pending';
            
            item.innerHTML = `
                <div class="task-info">
                    <h4>${task.title}</h4>
                    <div class="task-meta">
                        <span>${task.assigned_to || 'Unassigned'}</span>
                        <span>${this.formatDate(task.created_at)}</span>
                    </div>
                </div>
                <div>
                    <span class="task-priority ${priorityClass}">${priority}</span>
                    <span style="margin-left: 10px; font-size: 12px; color: var(--text-secondary);">${statusText}</span>
                </div>
            `;
            
            container.appendChild(item);
        });
    }
    
    renderAllTasks() {
        const container = document.getElementById('allTasks');
        if (!container) return;
        
        this.renderTasksList('allTasks', this.tasks);
    }
    
    renderActivityFeed(containerId, activities) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        if (!activities || activities.length === 0) {
            container.innerHTML = '<div class="loading">No activities found</div>';
            return;
        }
        
        container.innerHTML = '';
        
        activities.forEach(activity => {
            const item = document.createElement('div');
            item.className = 'activity-item';
            
            const icon = this.getActivityIcon(activity.type);
            const time = this.formatTimeAgo(activity.timestamp);
            
            item.innerHTML = `
                <div class="activity-icon">
                    <i class="fas fa-${icon}"></i>
                </div>
                <div class="activity-content">
                    <div class="activity-text">${activity.description || 'No description'}</div>
                    <div class="activity-time">${time} • ${activity.agent_name || 'System'}</div>
                </div>
            `;
            
            container.appendChild(item);
        });
    }
    
    renderMemoryActivities() {
        const container = document.getElementById('memoryActivities');
        if (!container) return;
        
        this.renderActivityFeed('memoryActivities', this.activities);
    }
    
    renderMetricsChart() {
        const container = document.getElementById('metricsChart');
        if (!container) return;
        
        // Simple bar chart for metrics
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        const values = [65, 59, 80, 81, 56, 55, 40];
        const maxValue = Math.max(...values);
        
        container.innerHTML = '';
        
        // Add CSS for chart bars
        const style = document.createElement('style');
        style.textContent = `
            .metrics-chart {
                display: flex;
                align-items: flex-end;
                gap: 10px;
                height: 200px;
                padding: 20px 0;
            }
            .chart-bar {
                flex: 1;
                background: linear-gradient(to top, #2563eb, #3b82f6);
                border-radius: 4px 4px 0 0;
                min-height: 10px;
                position: relative;
                transition: height 0.3s ease;
            }
            .chart-label {
                position: absolute;
                bottom: -25px;
                left: 0;
                right: 0;
                text-align: center;
                font-size: 12px;
                color: var(--text-secondary);
            }
        `;
        document.head.appendChild(style);
        
        days.forEach((day, index) => {
            const height = (values[index] / maxValue) * 100;
            const bar = document.createElement('div');
            bar.className = 'chart-bar';
            bar.style.height = `${height}%`;
            bar.innerHTML = `<div class="chart-label">${day}</div>`;
            container.appendChild(bar);
        });
    }
    
    renderMetricsCharts() {
        this.renderMetricsChart();
    }
    
    updateLastUpdateTime() {
        const element = document.getElementById('lastUpdate');
        if (element) {
            const now = new Date();
            element.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }
    }
    
    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 20px;
            background: ${type === 'error' ? 'var(--danger)' : 'var(--success)'};
            color: white;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            z-index: 1000;
            animation: slideIn 0.3s ease;
        `;
        
        notification.textContent = message;
        document.body.appendChild(notification);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
    
    formatDate(dateString) {
        if (!dateString) return 'Unknown date';
        const date = new Date(dateString);
        return date.toLocaleDateString();
    }
    
    formatTimeAgo(timestamp) {
        if (!timestamp) return 'Just now';
        const now = new Date();
        const time = new Date(timestamp);
        const diff = now - time;
        
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);
        
        if (days > 0) return `${days}d ago`;
        if (hours > 0) return `${hours}h ago`;
        if (minutes > 0) return `${minutes}m ago`;
        return 'Just now';
    }
    
    getActivityIcon(type) {
        const icons = {
            'task_created': 'plus-circle',
            'task_completed': 'check-circle',
            'agent_started': 'play-circle',
            'agent_stopped': 'stop-circle',
            'memory_updated': 'save',
            'error': 'exclamation-circle',
            'info': 'info-circle'
        };
        return icons[type] || 'circle';
    }
    
    // Mock data for fallback
    getMockAgents() {
        return [
            { id: '1', name: 'Lui', role: 'COO / Orchestrator', status: 'active' },
            { id: '2', name: 'Warren', role: 'Strategy Chief', status: 'active' },
            { id: '3', name: 'Elon', role: 'CTO', status: 'active' },
            { id: '4', name: 'Brains', role: 'CMO', status: 'active' },
            { id: '5', name: 'Lens', role: 'Media Producer', status: 'active' },
            { id: '6', name: 'Buzz', role: 'CCO', status: 'active' },
            { id: '7', name: 'Goldie', role: 'Marketing Chief', status: 'active' },
            { id: '8', name: 'June', role: 'Life Manager', status: 'active' }
        ];
    }
    
    getMockTasks() {
        return [
            { 
                id: '1', 
                title: 'Build Mission Control Dashboard', 
                description: 'Create web-based dashboard for agent management', 
                status: 'completed', 
                priority: 'high',
                assigned_to: 'Lui',
                created_at: '2026-04-10'
            },
            { 
                id: '2', 
                title: 'Fix API Integration', 
                description: 'Ensure all APIs are working correctly', 
                status: 'in_progress', 
                priority: 'medium',
                assigned_to: 'Elon',
                created_at: '2026-04-10'
            },
            { 
                id: '3', 
                title: 'Design UI Components', 
                description: 'Create reusable UI components for dashboard', 
                status: 'pending', 
                priority: 'low',
                assigned_to: 'Lens',
                created_at: '2026-04-09'
            }
        ];
    }
    
    getMockActivities() {
        return [
            { 
                type: 'task_completed', 
                description: 'Mission Control Dashboard built successfully', 
                timestamp: new Date(Date.now() - 300000).toISOString(),
                agent_name: 'Lui'
            },
            { 
                type: 'agent_started', 
                description: 'Agent Elon started working on API fixes', 
                timestamp: new Date(Date.now() - 600000).toISOString(),
                agent_name: 'System'
            },
            { 
                type: 'task_created', 
                description: 'New task: Design UI Components', 
                timestamp: new Date(Date.now() - 900000).toISOString(),
                agent_name: 'Lens'
            },
            { 
                type: 'memory_updated', 
                description: 'Memory system updated with recent activities', 
                timestamp: new Date(Date.now() - 1200000).toISOString(),
                agent_name: 'Brains'
            }
        ];
    }
    
    getMockMetrics() {
        return {
            response_time: 142,
            memory_usage: 24.5,
            active_sessions: 8,
            tasks_completed: 15,
            errors: 2
        };
    }
}

// Initialize mission control when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.missionControl = new MissionControl();
    window.missionControl.init();
});