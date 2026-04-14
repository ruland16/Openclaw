# Mission Control Dashboard - Deployment Guide

## Overview
This guide covers deployment, configuration, and maintenance of the Mission Control Dashboard system. It includes setup instructions for development, staging, and production environments.

**System Components:**
1. **Backend:** Node.js + Express + SQLite
2. **Frontend:** HTML/CSS/JS dashboard
3. **Real-time:** WebSocket server
4. **Database:** SQLite with migration support

---

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Development Setup](#development-setup)
3. [Production Deployment](#production-deployment)
4. [Configuration Options](#configuration-options)
5. [Database Management](#database-management)
6. [Monitoring & Maintenance](#monitoring--maintenance)
7. [Backup & Recovery](#backup--recovery)
8. [Scaling Considerations](#scaling-considerations)
9. [Security Hardening](#security-hardening)
10. [Troubleshooting Deployment](#troubleshooting-deployment)

---

## Prerequisites

### System Requirements
- **Node.js:** 16.x or higher
- **npm:** 8.x or higher
- **SQLite:** 3.35+ (comes with Node.js sqlite3 package)
- **Operating System:** Linux, macOS, or Windows (WSL2 recommended for Windows)

### Hardware Requirements
| Environment | CPU | RAM | Storage | Notes |
|------------|-----|-----|---------|-------|
| Development | 2 cores | 2GB | 1GB | Local testing |
| Staging | 2 cores | 4GB | 10GB | Pre-production |
| Production | 4 cores | 8GB | 50GB+ | With monitoring |

### Network Requirements
- **Ports:** 3000 (default), or configured port
- **Firewall:** Allow inbound connections to dashboard port
- **DNS:** Domain name for production (optional)
- **SSL/TLS:** Certificate for HTTPS (production)

---

## Development Setup

### Step 1: Clone and Prepare
```bash
# Clone repository or copy files
cd /home/user/.openclaw/workspace

# Verify files exist
ls -la server.js db.js package.json
```

### Step 2: Install Dependencies
```bash
# Install npm packages
npm install

# Verify installation
npm list --depth=0
```

### Step 3: Initialize Database
```bash
# Create and populate database
node initDatabase.js

# Verify database
sqlite3 mission_control.db ".tables"
```

### Step 4: Start Development Server
```bash
# Start server with nodemon (if installed)
npm run dev

# Or start directly
node server.js

# Test server
curl http://localhost:3000/api/health
```

### Step 5: Access Dashboard
1. Open browser to: `http://localhost:3000`
2. View wireframe: Open `ui-design/wireframes/dashboard-overview.html`
3. Test API endpoints: Use `test_api.js` or Postman

### Development Scripts
```bash
# Package.json scripts
npm run dev          # Start with nodemon
npm test            # Run tests
npm run lint        # Lint code (if configured)
```

---

## Production Deployment

### Option 1: Direct Node.js Deployment

#### Step 1: Prepare Server
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Verify installation
node --version
npm --version
```

#### Step 2: Deploy Application
```bash
# Create deployment directory
sudo mkdir -p /opt/mission-control
sudo chown -R $USER:$USER /opt/mission-control

# Copy application files
cp -r /home/user/.openclaw/workspace/* /opt/mission-control/
cd /opt/mission-control

# Install dependencies
npm install --production
```

#### Step 3: Configure Environment
```bash
# Create environment file
cat > .env << EOF
PORT=3000
HOST=0.0.0.0
NODE_ENV=production
DATABASE_PATH=/opt/mission-control/mission_control.db
LOG_LEVEL=info
EOF

# Initialize database
node initDatabase.js
```

#### Step 4: Set Up Process Manager (PM2)
```bash
# Install PM2 globally
sudo npm install -g pm2

# Start application with PM2
pm2 start server.js --name "mission-control"

# Configure PM2 to start on boot
pm2 startup
pm2 save

# Monitor application
pm2 status
pm2 logs mission-control
```

#### Step 5: Configure Reverse Proxy (nginx)
```bash
# Install nginx
sudo apt install -y nginx

# Create nginx configuration
sudo nano /etc/nginx/sites-available/mission-control
```

**nginx configuration:**
```nginx
server {
    listen 80;
    server_name dashboard.example.com;  # Your domain
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # WebSocket support
    location /ws {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "Upgrade";
        proxy_set_header Host $host;
    }
}
```

```bash
# Enable site and restart nginx
sudo ln -s /etc/nginx/sites-available/mission-control /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### Step 6: Set Up SSL (Let's Encrypt)
```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d dashboard.example.com

# Auto-renewal setup
sudo certbot renew --dry-run
```

### Option 2: Docker Deployment

#### Dockerfile
```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application files
COPY . .

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Change ownership
RUN chown -R nodejs:nodejs /app

USER nodejs

# Expose port
EXPOSE 3000

# Start application
CMD ["node", "server.js"]
```

#### docker-compose.yml
```yaml
version: '3.8'

services:
  mission-control:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - PORT=3000
      - HOST=0.0.0.0
    volumes:
      - mission-control-data:/app/data
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3

volumes:
  mission-control-data:
```

#### Deployment Commands
```bash
# Build and run
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Option 3: Cloud Deployment (AWS Example)

#### EC2 Setup
```bash
# Launch EC2 instance (Ubuntu 22.04, t3.small)
# Connect via SSH
ssh -i your-key.pem ubuntu@ec2-instance-ip

# Follow Option 1 instructions above
# Add security group rules for ports 80, 443, 3000
```

#### RDS Setup (Optional - for PostgreSQL migration)
1. Create PostgreSQL RDS instance
2. Update database configuration
3. Migrate data from SQLite

---

## Configuration Options

### Environment Variables
| Variable | Default | Description | Required |
|----------|---------|-------------|----------|
| `PORT` | 3000 | Server port | No |
| `HOST` | localhost | Server host | No |
| `NODE_ENV` | development | Environment | No |
| `DATABASE_PATH` | ./mission_control.db | Database file path | No |
| `LOG_LEVEL` | info | Logging level | No |
| `CORS_ORIGIN` | * | CORS allowed origins | No |
| `SESSION_SECRET` | (generated) | Session secret | Production |
| `JWT_SECRET` | (generated) | JWT secret | Production |

### Database Configuration
**SQLite (Default):**
```javascript
// db.js configuration
const dbPath = process.env.DATABASE_PATH || './mission_control.db';
const db = new sqlite3.Database(dbPath);
```

**PostgreSQL (Migration):**
```javascript
// Update db.js for PostgreSQL
const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});
```

### Logging Configuration
```javascript
// In server.js
const logLevel = process.env.LOG_LEVEL || 'info';

// Configure morgan based on environment
if (process.env.NODE_ENV === 'production') {
  app.use(morgan('combined'));
} else {
  app.use(morgan('dev'));
}
```

### Security Configuration
```javascript
// Helmet.js configuration
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "ws://localhost:3000"]
    }
  }
}));
```

---

## Database Management

### Initialization
```bash
# Create fresh database
node initDatabase.js

# Verify tables
sqlite3 mission_control.db ".schema"

# Check sample data
sqlite3 mission_control.db "SELECT COUNT(*) FROM agents;"
```

### Migration
#### SQLite to PostgreSQL
1. **Export SQLite data:**
   ```bash
   sqlite3 mission_control.db .dump > mission_control.sql
   ```

2. **Create PostgreSQL database:**
   ```sql
   CREATE DATABASE mission_control;
   \c mission_control;
   ```

3. **Import data (manual adjustment needed for SQL differences):**
   ```bash
   psql mission_control < mission_control.sql
   ```

4. **Update application configuration:**
   ```javascript
   // Change db.js to use pg instead of sqlite3
   ```

### Backup Procedures
#### Automated Backup Script
Create `backup-database.sh`:
```bash
#!/bin/bash
BACKUP_DIR="/backups/mission-control"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/mission_control_$DATE.db"

mkdir -p $BACKUP_DIR
cp /opt/mission-control/mission_control.db $BACKUP_FILE

# Keep last 30 days of backups
find $BACKUP_DIR -name "mission_control_*.db" -mtime +30 -delete

echo "Backup completed: $BACKUP_FILE"
```

#### Cron Job for Daily Backups
```bash
# Add to crontab
0 2 * * * /opt/mission-control/backup-database.sh
```

### Performance Tuning
#### SQLite Optimization
```sql
-- Add indexes for common queries
CREATE INDEX idx_agent_activities_timestamp ON agent_activities(timestamp);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_agent_status ON agents(status);

-- Configure pragmas
PRAGMA journal_mode = WAL;
PRAGMA synchronous = NORMAL;
PRAGMA cache_size = -2000;  -- 2MB cache
```

#### Connection Pooling
For PostgreSQL:
```javascript
const pool = new Pool({
  max: 20,  // Maximum connections
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000
});
```

---

## Monitoring & Maintenance

### Health Checks
```bash
# API health endpoint
curl http://localhost:3000/api/health

# Database health
sqlite3 mission_control.db "SELECT 1;"

# WebSocket health
wscat -c ws://localhost:3000 -x '{"type": "heartbeat"}'
```

### Log Management
#### Log Rotation with logrotate
Create `/etc/logrotate.d/mission-control`:
```
/opt/mission-control/logs/*.log {
    daily
    missingok
    rotate 14
    compress
    delaycompress
    notifempty
    create 0640 www-data www-data
    sharedscripts
    postrotate
        pm2 reload mission-control --update-env
    endscript
}
```

#### Structured Logging
```javascript
// Add Winston or Pino for production
const logger = require('pino')({
  level: process.env.LOG_LEVEL || 'info',
  timestamp: () => `,"time":"${new Date().toISOString()}"`
});
```

### Performance Monitoring
#### Key Metrics to Monitor
1. **API Response Times:** >95% under 200ms
2. **Database Query Times:** >95% under 50ms
3. **Memory Usage:** <80% of available
4. **CPU Usage:** <70% average
5. **Active Connections:** <1000 WebSocket connections

#### Monitoring Tools
- **PM2:** `pm2 monit`
- **htop:** System resource monitoring
- **sqlite3_analyzer:** Database performance
- **Custom metrics endpoint:** `/api/dashboard/stats`

### Regular Maintenance Tasks
#### Daily
1. Check error logs
2. Verify backups completed
3. Monitor disk space
4. Review active connections

#### Weekly
1. Analyze slow queries
2. Update dependencies (`npm outdated`)
3. Clean up old logs
4. Review security patches

#### Monthly
1. Performance benchmarking
2. Database optimization (VACUUM for SQLite)
3. Security audit
4. Capacity planning

---

## Backup & Recovery

### Backup Strategy
#### 1. Database Backups
- **Frequency:** Daily full backup
- **Retention:** 30 days
- **Location:** Local + remote storage
- **Verification:** Automated restore test weekly

#### 2. Configuration Backups
- **Frequency:** On change
- **Items:** `.env`, `package.json`, configuration files
- **Version Control:** Git repository

#### 3. Log Backups
- **Frequency:** Weekly
- **Retention:** 90 days
- **Compression:** gzip

### Recovery Procedures
#### Complete System Failure
1. **Restore from backup:**
   ```bash
   # Stop application
   pm2 stop mission-control
   
   # Restore database
   cp /backups/mission_control_20240410.db /opt/mission-control/mission_control.db
   
   # Restore configuration
   cp /backups/config.tar.gz /opt/mission-control/
   tar -xzf config.tar.gz
   
   # Start application
   pm2 start mission-control
   ```

2. **Verify recovery:**
   ```bash
   curl http://localhost:3000/api/health
   sqlite3 mission_control.db "SELECT COUNT(*) FROM agents;"
   ```

#### Partial Data Corruption
1. **Identify corrupted data:**
   ```bash
   sqlite3 mission_control.db "PRAGMA integrity_check;"
   ```

2. **Restore specific tables:**
   ```sql
   -- Export good data
   .output good_data.sql
   .dump agents tasks
   .output stdout
   
   -- Restore
   .read good_data.sql
   ```

#### Rollback Procedure
1. **Identify last good state:**
   ```bash
   ls -la /backups/ | grep mission_control
   ```

2. **Rollback database:**
   ```bash
   # Find timestamp before issue
   BACKUP_FILE="/backups/mission_control_20240409.db"
   
   # Restore
   cp $BACKUP_FILE /opt/mission-control/mission_control.db
   
   # Restart
   pm2 restart mission-control
   ```

### Disaster Recovery Plan
#### RTO (Recovery Time Objective): 2 hours
#### RPO (Recovery Point Objective): 24 hours

#### Steps:
1. **Assessment:** Determine scope of failure
2. **Communication:** Notify stakeholders
3. **Recovery:** Execute backup restoration
4. **Validation:** Verify system functionality
5. **Documentation:** Record incident and recovery

---

## Scaling Considerations

### Vertical Scaling
#### When to Scale Up:
- CPU consistently >70%
- Memory consistently >80%
- Database file >10GB

#### Scaling Steps:
1. Upgrade server resources (CPU, RAM)
2. Adjust SQLite cache size
3. Increase Node.js memory limit: `node --max-old-space-size=4096 server.js`

### Horizontal Scaling
#### Challenges:
1. SQLite doesn't support multiple writers
2. WebSocket connections need coordination
3. Session state management

#### Solutions:
1. **Migrate to PostgreSQL:** Supports concurrent connections
2. **Redis for WebSocket coordination:** Broadcast messages across instances
3. **Load balancer with sticky sessions:** Route WebSocket connections

#### Architecture for Horizontal Scaling:
```
Load Balancer (nginx)
        ↓
   [App Server 1] ←→ [PostgreSQL]
        ↓               ↑
   [App Server 2] ←→ [Redis (Pub/Sub)]
        ↓
   [App Server 3]
```

### Database Scaling
#### SQLite Limits:
- **Max database size:** ~140TB
- **Max concurrent writers:** 1
- **Practical limit:** 10GB for optimal performance

#### Migration to PostgreSQL:
1. **When