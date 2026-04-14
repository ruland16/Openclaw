// Mission Control Dashboard - Interactive Components
// Created by Lens (Media Producer)

class ThemeManager {
    constructor() {
        this.theme = localStorage.getItem('theme') || 'light';
        this.init();
    }

    init() {
        this.applyTheme();
        this.setupEventListeners();
    }

    applyTheme() {
        document.documentElement.classList.remove('theme-light', 'theme-dark');
        document.documentElement.classList.add(`theme-${this.theme}`);
        localStorage.setItem('theme', this.theme);
    }

    toggleTheme() {
        this.theme = this.theme === 'light' ? 'dark' : 'light';
        this.applyTheme();
        return this.theme;
    }

    setupEventListeners() {
        // Theme toggle buttons
        document.querySelectorAll('[data-theme-toggle]').forEach(button => {
            button.addEventListener('click', () => {
                const newTheme = this.toggleTheme();
                button.setAttribute('aria-label', `Switch to ${newTheme === 'light' ? 'dark' : 'light'} theme`);
                
                // Update button icon/text if present
                const icon = button.querySelector('.theme-icon');
                if (icon) {
                    icon.textContent = newTheme === 'light' ? '🌙' : '☀️';
                }
            });
        });
    }
}

class AgentStatusManager {
    constructor() {
        this.agents = new Map();
        this.init();
    }

    init() {
        this.loadMockData();
        this.renderAgents();
        this.setupWebSocket();
    }

    loadMockData() {
        // Mock agent data - will be replaced with real API
        this.agents.set('lui', {
            id: 'lui',
            name: 'Lui',
            role: 'COO / Orchestrator',
            status: 'active',
            avatar: '🦞',
            color: '#2563eb',
            tasks: 8,
            progress: 65,
            uptime: '24h',
            cpu: 42,
            lastUpdate: Date.now() - 300000, // 5 minutes ago
            currentTask: 'Coordinating team spawn'
        });

        this.agents.set('warren', {
            id: 'warren',
            name: 'Warren',
            role: 'Strategy Chief',
            status: 'active',
            avatar: '🧠',
            color: '#7c3aed',
            tasks: 6,
            progress: 45,
            uptime: '12h',
            cpu: 38,
            lastUpdate: Date.now() - 600000, // 10 minutes ago
            currentTask: 'Researching requirements'
        });

        this.agents.set('elon', {
            id: 'elon',
            name: 'Elon',
            role: 'CTO',
            status: 'busy',
            avatar: '⚡',
            color: '#10b981',
            tasks: 10,
            progress: 85,
            uptime: '8h',
            cpu: 92,
            lastUpdate: Date.now() - 120000, // 2 minutes ago
            currentTask: 'Database design'
        });

        this.agents.set('lens', {
            id: 'lens',
            name: 'Lens',
            role: 'Media Producer',
            status: 'active',
            avatar: '🎨',
            color: '#f59e0b',
            tasks: 5,
            progress: 15,
            uptime: '1h',
            cpu: 28,
            lastUpdate: Date.now(),
            currentTask: 'UI/UX design'
        });
    }

    renderAgents() {
        const container = document.getElementById('agents-grid');
        if (!container) return;

        container.innerHTML = '';
        
        for (const agent of this.agents.values()) {
            const card = this.createAgentCard(agent);
            container.appendChild(card);
        }
    }

    createAgentCard(agent) {
        const card = document.createElement('div');
        card.className = 'agent-card';
        card.dataset.agentId = agent.id;

        const timeAgo = this.formatTimeAgo(agent.lastUpdate);
        
        card.innerHTML = `
            <div class="flex items-center">
                <div class="agent-avatar" style="background-color: ${agent.color}">
                    ${agent.avatar}
                </div>
                <div class="flex-1">
                    <div class="flex items-center justify-between">
                        <div>
                            <h4 class="agent-name">${agent.name}</h4>
                            <p class="text-sm text-muted">${agent.role}</p>
                        </div>
                        <span class="agent-status status-${agent.status}">
                            ${agent.status.charAt(0).toUpperCase() + agent.status.slice(1)}
                        </span>
                    </div>
                    <p class="text-sm mt-2">${agent.currentTask}</p>
                </div>
            </div>
            <div class="grid grid-4 gap-3 mt-4">
                <div class="text-center">
                    <div class="text-xs text-muted">Tasks</div>
                    <div class="font-semibold">${agent.tasks}</div>
                </div>
                <div class="text-center">
                    <div class="text-xs text-muted">Progress</div>
                    <div class="font-semibold">${agent.progress}%</div>
                </div>
                <div class="text-center">
                    <div class="text-xs text-muted">Uptime</div>
                    <div class="font-semibold">${agent.uptime}</div>
                </div>
                <div class="text-center">
                    <div class="text-xs text-muted">CPU</div>
                    <div class="font-semibold">${agent.cpu}%</div>
                </div>
            </div>
            <div class="mt-3">
                <div class="progress">
                    <div class="progress-bar" style="width: ${agent.progress}%"></div>
                </div>
                <div class="text-xs text-muted mt-1 text-right">Updated ${timeAgo}</div>
            </div>
        `;

        return card;
    }

    formatTimeAgo(timestamp) {
        const seconds = Math.floor((Date.now() - timestamp) / 1000);
        
        if (seconds < 60) return 'just now';
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
        return `${Math.floor(seconds / 86400)}d ago`;
    }

    setupWebSocket() {
        // This will be replaced with real WebSocket connection
        console.log('WebSocket setup for real-time agent updates');
        
        // Simulate real-time updates
        setInterval(() => {
            this.simulateAgentUpdate();
        }, 30000); // Update every 30 seconds
    }

    simulateAgentUpdate() {
        const agents = Array.from(this.agents.values());
        const randomAgent = agents[Math.floor(Math.random() * agents.length)];
        
        // Simulate small changes
        randomAgent.progress = Math.min(100, randomAgent.progress + Math.floor(Math.random() * 5));
        randomAgent.cpu = Math.max(10, Math.min(100, randomAgent.cpu + Math.floor(Math.random() * 10) - 5));
        randomAgent.lastUpdate = Date.now();
        
        // Update the specific agent card
        this.updateAgentCard(randomAgent);
    }

    updateAgentCard(agent) {
        const card = document.querySelector(`[data-agent-id="${agent.id}"]`);
        if (card) {
            const progressBar = card.querySelector('.progress-bar');
            const progressText = card.querySelector('.font-semibold:nth-child(2)');
            const cpuText = card.querySelector('.font-semibold:nth-child(4)');
            const timeText = card.querySelector('.text-right');
            
            if (progressBar) progressBar.style.width = `${agent.progress}%`;
            if (progressText) progressText.textContent = `${agent.progress}%`;
            if (cpuText) cpuText.textContent = `${agent.cpu}%`;
            if (timeText) timeText.textContent = `Updated ${this.formatTimeAgo(agent.lastUpdate)}`;
            
            // Add visual feedback
            card.classList.add('updating');
            setTimeout(() => card.classList.remove('updating'), 500);
        }
    }
}

class TaskManager {
    constructor() {
        this.tasks = [];
        this.init();
    }

    init() {
        this.loadMockTasks();
        this.renderTaskBoard();
    }

    loadMockTasks() {
        this.tasks = [
            {
                id: 'task-1',
                title: 'Design dashboard architecture',
                description: 'Create overall dashboard structure and navigation',
                assignee: 'lui',
                priority: 'high',
                status: 'in-progress',
                dueDate: '2026-04-11',
                createdAt: '2026-04-10'
            },
            {
                id: 'task-2',
                title: 'Research mission control patterns',
                description: 'Analyze existing OpenClaw management tools',
                assignee: 'warren',
                priority: 'medium',
                status: 'todo',
                dueDate: '2026-04-11',
                createdAt: '2026-04-10'
            },
            {
                id: 'task-3',
                title: 'Database schema design',
                description: 'Design agent activity data structure',
                assignee: 'elon',
                priority: 'high',
                status: 'in-progress',
                dueDate: '2026-04-10',
                createdAt: '2026-04-10'
            },
            {
                id: 'task-4',
                title: 'Create UI design system',
                description: 'Design color palette, typography, and components',
                assignee: 'lens',
                priority: 'medium',
                status: 'in-progress',
                dueDate: '2026-04-12',
                createdAt: '2026-04-10'
            },
            {
                id: 'task-5',
                title: 'Set up project documentation',
                description: 'Create initial project README and guides',
                assignee: 'buzz',
                priority: 'low',
                status: 'todo',
                dueDate: '2026-04-13',
                createdAt: '2026-04-10'
            }
        ];
    }

    renderTaskBoard() {
        const board = document.getElementById('task-board');
        if (!board) return;

        const columns = {
            'todo': this.tasks.filter(t => t.status === 'todo'),
            'in-progress': this.tasks.filter(t => t.status === 'in-progress'),
            'review': this.tasks.filter(t => t.status === 'review'),
            'done': this.tasks.filter(t => t.status === 'done')
        };

        board.innerHTML = '';
        
        for (const [columnId, tasks] of Object.entries(columns)) {
            const column = this.createTaskColumn(columnId, tasks);
            board.appendChild(column);
        }
    }

    createTaskColumn(columnId, tasks) {
        const column = document.createElement('div');
        column.className = 'task-column';
        column.dataset.column = columnId;

        const columnName = columnId.split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');

        column.innerHTML = `
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">${columnName}</h3>
                    <span class="badge">${tasks.length}</span>
                </div>
                <div class="task-list">
                    ${tasks.map(task => this.createTaskCard(task)).join('')}
                </div>
                <button class="btn btn-outline w-full mt-3" data-add-task="${columnId}">
                    + Add Task
                </button>
            </div>
        `;

        return column;
    }

    createTaskCard(task) {
        const priorityColors = {
            'high': 'badge-danger',
            'medium': 'badge-warning',
            'low': 'badge-success'
        };

        const assignee = this.getAgentById(task.assignee);
        
        return `
            <div class="task-card" data-task-id="${task.id}" draggable="true">
                <div class="flex items-center justify-between mb-2">
                    <span class="${priorityColors[task.priority]}">
                        ${task.priority}
                    </span>
                    <div class="flex items-center gap-2">
                        ${assignee ? `
                            <div class="agent-avatar-small" style="background-color: ${assignee.color}">
                                ${assignee.avatar}
                            </div>
                        ` : ''}
                    </div>
                </div>
                <h4 class="font-semibold mb-1">${task.title}</h4>
                <p class="text-sm text-muted mb-2">${task.description}</p>
                <div class="flex items-center justify-between text-xs text-muted">
                    <span>Due: ${task.dueDate}</span>
                    <button class="btn btn-sm btn-outline" data-view-task="${task.id}">
                        View
                    </button>
                </div>
            </div>
        `;
    }

    getAgentById(agentId) {
        // This would connect to the AgentStatusManager
        const agents = {
            'lui': { avatar: '🦞', color: '#2563eb' },
            'warren': { avatar: '🧠', color: '#7c3aed' },
            'elon': { avatar: '⚡', color: '#10b981' },
            'lens': { avatar: '🎨', color: '#f59e0b' },
            'buzz': { avatar: '🎥', color: '#ef4444' }
        };
        return agents[agentId];
    }
}

class NotificationManager {
    constructor() {
        this.notifications = [];
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.simulateNotifications();
    }

    setupEventListeners() {
        // Notification bell click
        document.querySelectorAll('[data-notification-bell]').forEach(bell => {
            bell.addEventListener('click', () => {
                this.toggleNotificationPanel();
            });
        });
    }

    toggleNotificationPanel() {
        const panel = document.getElementById('notification-panel');
        if (panel) {
            panel.classList.toggle('hidden');
        } else {
            this.createNotificationPanel();
        }
    }

    createNotificationPanel() {
        const panel = document.createElement('div');
        panel.id = 'notification-panel';
        panel.className = 'notification-panel';
        
        panel.innerHTML = `
            <div class="notification-header">
                <h3>Notifications</h3>
                <button class="btn btn-sm" data-mark-all-read>Mark all read</button>
            </div>
            <div class="notification-list">
                ${this.notifications.map(n => this.createNotificationItem(n)).join('')}
            </div>
        `;

        document.body.appendChild(panel);
    }

    createNotificationItem(notification) {
        return `
            <div class="notification-item ${notification.read ? 'read' : 'unread'}">
                <div class="notification-icon">${notification.icon}</div>
                <div class="notification-content">
                    <div class="notification-text">${notification.text}</div>
                    <div class="notification-time">${notification.time}</div>
                </div>
            </div>
        `;
    }

    simulateNotifications() {
        // Simulate receiving notifications
        setInterval(() => {
            if (Math.random() > 0.7) { // 30% chance
                this.addNotification({
                    icon: '🔄',
                    text: 'Agent status updated',
                    time: 'Just now',
                    read: false
                });
            }
        }, 60000); // Check every minute
    }

    addNotification(notification) {
        this.notifications.unshift(notification);
        this.updateNotificationBadge();
        
        // Show toast notification
        this.showToast(notification);
    }

    updateNotificationBadge() {
        const unreadCount = this.notifications.filter(n => !n.read).length;
        const badge = document.querySelector('[data-notification-badge]');
        
        if (badge) {
            badge.textContent = unreadCount > 0 ? unreadCount : '';
            badge.classList.toggle('hidden', unreadCount === 0);
        }
    }

    showToast(notification) {
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = `
            <div class="flex items-center gap-3">
                <div class="toast-icon">${notification.icon}</div>
                <div>
                    <div class="toast-text">${notification.text}</div>
                    <div class="toast-time text-xs text-muted">${notification.time}</div>
                </div>
            </div>
        `;

        const container = document.getElementById('toast-container') || this.createToastContainer();
        container.appendChild(toast);

        // Remove toast after 5 seconds
        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 5000);
    }

    createToastContainer() {
        const container = document.createElement('div');
        container.id = 'toast-container';
        container.className = 'toast-container';
        document.body.appendChild(container);
        return container;
    }
}

// Initialize all managers when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const themeManager = new ThemeManager();
    const agentManager = new AgentStatusManager();
    const taskManager = new TaskManager();
    const notificationManager = new NotificationManager();

    // Make managers available globally for debugging
    window.dashboard = {
        themeManager,
        agentManager,
        taskManager,
        notificationManager
    };

    console.log('Mission Control Dashboard initialized');
});