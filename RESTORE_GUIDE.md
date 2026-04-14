# Quick Restore Guide: GitHub & Local Backups

This guide explains how to quickly restore your OpenClaw workspace from both GitHub repositories and local backup files.

## 📦 **Backup Locations**

### **1. GitHub Repository**
- **URL:** `https://github.com/ruland16/Openclaw.git`
- **Frequency:** Auto-pushed after each backup (11 PM & 12 PM daily)
- **Content:** Git repository with commit history

### **2. Local Backups**
- **Directory:** `/home/user/.openclaw-backups/`
- **Files:** `workspace_backup_YYYYMMDD_HHMMSS.tar.gz`
- **Frequency:** 11 PM & 12 PM daily
- **Retention:** 30 days

---

## 🚀 **Quick Restore Methods**

### **Method 1: GitHub Clone (Fastest - Recommended)**
```bash
# 1. Navigate to parent directory
cd /home/user

# 2. Clone the repository (if starting fresh)
git clone https://github.com/ruland16/Openclaw.git openclaw-workspace-new

# 3. OR if you want to restore to existing directory
cd /home/user/.openclaw/workspace
git fetch origin
git reset --hard origin/master
```

### **Method 2: Local Backup Restore**
```bash
# 1. List available backups
ls -la /home/user/.openclaw-backups/workspace_backup_*.tar.gz

# 2. Find the latest backup
LATEST=$(ls -t /home/user/.openclaw-backups/workspace_backup_*.tar.gz | head -1)

# 3. Extract to restore location
# Option A: Restore to new directory
mkdir -p /home/user/restored-workspace
tar -xzf "$LATEST" -C /home/user/restored-workspace

# Option B: Restore over existing workspace (DESTRUCTIVE!)
cd /home/user/.openclaw/workspace
tar -xzf "$LATEST" --strip-components=1
```

### **Method 3: Selective File Restore**
```bash
# Restore specific files/directories from backup
tar -xzf /home/user/.openclaw-backups/workspace_backup_20260410_120002.tar.gz \
  -C /home/user/.openclaw/workspace \
  --strip-components=1 \
  ./agents/Lui/ ./memory/ ./AGENT_STATUS.md
```

---

## 🔄 **Complete Restoration Workflow**

### **Scenario A: Complete Workspace Loss**
```bash
#!/bin/bash
# Complete restoration script

# 1. Stop OpenClaw if running
openclaw gateway stop 2>/dev/null || true

# 2. Backup current state (just in case)
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
mv /home/user/.openclaw/workspace /home/user/.openclaw/workspace.bak.$TIMESTAMP 2>/dev/null || true

# 3. Choose restoration method
echo "Choose restoration method:"
echo "1) GitHub clone (latest)"
echo "2) Local backup (choose from list)"
read -p "Enter choice (1 or 2): " CHOICE

if [ "$CHOICE" = "1" ]; then
    # GitHub restore
    git clone https://github.com/ruland16/Openclaw.git /home/user/.openclaw/workspace
    echo "✅ Restored from GitHub"
else
    # Local backup restore
    echo "Available backups:"
    ls -t /home/user/.openclaw-backups/workspace_backup_*.tar.gz
    read -p "Enter full backup path: " BACKUP_PATH
    mkdir -p /home/user/.openclaw/workspace
    tar -xzf "$BACKUP_PATH" -C /home/user/.openclaw/workspace --strip-components=1
    echo "✅ Restored from local backup"
fi

# 4. Restart OpenClaw
openclaw gateway start
echo "✅ Restoration complete! OpenClaw restarted."
```

### **Scenario B: Partial Corruption**
```bash
#!/bin/bash
# Partial restoration - keep some files

# 1. Create temporary restore directory
mkdir -p /tmp/restore-temp

# 2. Extract backup to temp location
BACKUP=$(ls -t /home/user/.openclaw-backups/workspace_backup_*.tar.gz | head -1)
tar -xzf "$BACKUP" -C /tmp/restore-temp --strip-components=1

# 3. Compare and restore missing/corrupted files
# Example: Restore agent configurations
cp -r /tmp/restore-temp/agents/ /home/user/.openclaw/workspace/

# 4. Clean up
rm -rf /tmp/restore-temp
echo "✅ Partial restoration complete"
```

---

## 🛡️ **Verification Steps**

After restoration, verify everything works:

```bash
# 1. Check workspace structure
ls -la /home/user/.openclaw/workspace/

# 2. Verify agent directories exist
ls -la /home/user/.openclaw/workspace/agents/

# 3. Check memory files
ls -la /home/user/.openclaw/workspace/memory/

# 4. Test OpenClaw
openclaw status
openclaw gateway status

# 5. Verify GitHub connection
cd /home/user/.openclaw/workspace
git status
git log --oneline -3
```

---

## ⚠️ **Important Notes**

### **Before Restoring:**
1. **Stop OpenClaw:** `openclaw gateway stop`
2. **Backup current state** (if not completely broken)
3. **Note custom configurations** that might not be in backups

### **GitHub Specific:**
- Requires internet connection
- May need authentication if using SSH
- Contains full commit history for rollback

### **Local Backup Specific:**
- No internet required
- Limited to 30 days of history
- Larger files (tar.gz format)

### **What Gets Restored:**
✅ Workspace files and directories  
✅ Agent configurations (soul.md, etc.)  
✅ Memory files (MEMORY.md, memory/*.md)  
✅ Project documentation  
✅ Scripts and automation files  

### **What Might NOT Be Restored:**
❌ OpenClaw system configuration (`~/.openclaw/config/`)  
❌ Credentials and API keys  
❌ Running session states  
❌ Temporary files  

---

## 🚨 **Emergency One-Liners**

### **Quick GitHub Restore:**
```bash
cd /home/user && rm -rf .openclaw/workspace && git clone https://github.com/ruland16/Openclaw.git .openclaw/workspace
```

### **Latest Local Backup Restore:**
```bash
cd /home/user/.openclaw/workspace && tar -xzf $(ls -t /home/user/.openclaw-backups/workspace_backup_*.tar.gz | head -1) --strip-components=1
```

### **Check Backup Health:**
```bash
# Verify backups exist
test -f $(ls -t /home/user/.openclaw-backups/workspace_backup_*.tar.gz | head -1) && echo "✅ Backups OK" || echo "❌ No backups found"

# Verify GitHub connection
cd /home/user/.openclaw/workspace 2>/dev/null && git remote -v | grep -q origin && echo "✅ GitHub configured" || echo "❌ GitHub not configured"
```

---

## 📞 **Troubleshooting**

### **Issue: GitHub authentication failed**
```bash
# Update remote URL
cd /home/user/.openclaw/workspace
git remote set-url origin https://github.com/ruland16/Openclaw.git
```

### **Issue: Backup file corrupted**
```bash
# Test backup integrity
tar -tzf /home/user/.openclaw-backups/workspace_backup_*.tar.gz >/dev/null && echo "✅ Backup OK" || echo "❌ Backup corrupted"
```

### **Issue: Permission errors**
```bash
# Fix permissions
sudo chown -R user:user /home/user/.openclaw/
sudo chmod -R 755 /home/user/.openclaw/workspace/
```

---

## 🔧 **Automated Restoration Script**

Save this as `/home/user/.openclaw/restore.sh`:

```bash
#!/bin/bash
# OpenClaw Automated Restore Script

set -e

BACKUP_DIR="/home/user/.openclaw-backups"
WORKSPACE_DIR="/home/user/.openclaw/workspace"
LOG_FILE="/home/user/.openclaw-backups/restore.log"

log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

log "Starting OpenClaw restoration..."

# Stop OpenClaw
log "Stopping OpenClaw..."
openclaw gateway stop 2>/dev/null || log "OpenClaw not running or stop failed"

# Backup current workspace
if [ -d "$WORKSPACE_DIR" ]; then
    TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
    BACKUP_NAME="pre_restore_backup_$TIMESTAMP.tar.gz"
    tar -czf "$BACKUP_DIR/$BACKUP_NAME" -C "$WORKSPACE_DIR" . 2>/dev/null
    log "Created pre-restore backup: $BACKUP_NAME"
fi

# Choose restore source
if [ "$1" = "github" ]; then
    log "Restoring from GitHub..."
    rm -rf "$WORKSPACE_DIR"
    git clone https://github.com/ruland16/Openclaw.git "$WORKSPACE_DIR"
    log "GitHub restoration complete"
elif [ "$1" = "local" ]; then
    LATEST=$(ls -t "$BACKUP_DIR"/workspace_backup_*.tar.gz | head -1)
    if [ -z "$LATEST" ]; then
        log "ERROR: No local backups found"
        exit 1
    fi
    log "Restoring from local backup: $(basename "$LATEST")"
    rm -rf "$WORKSPACE_DIR"
    mkdir -p "$WORKSPACE_DIR"
    tar -xzf "$LATEST" -C "$WORKSPACE_DIR" --strip-components=1
    log "Local restoration complete"
else
    log "Usage: $0 [github|local]"
    exit 1
fi

# Start OpenClaw
log "Starting OpenClaw..."
openclaw gateway start
log "Restoration complete!"
```

Make it executable:
```bash
chmod +x /home/user/.openclaw/restore.sh
```

**Usage:**
```bash
# Restore from GitHub
/home/user/.openclaw/restore.sh github

# Restore from latest local backup
/home/user/.openclaw/restore.sh local
```

---

## 📋 **Quick Reference Card**

```
┌─────────────────────────────────────────────┐
│          OPENCLAW RESTORE GUIDE             │
├─────────────────────────────────────────────┤
│ 1. STOP: openclaw gateway stop             │
│ 2. BACKUP: tar current workspace           │
│ 3. RESTORE: Choose method below            │
│    • GitHub: git clone                     │
│    • Local: tar -xzf latest_backup.tar.gz  │
│ 4. START: openclaw gateway start           │
│ 5. VERIFY: Check agents & memory           │
└─────────────────────────────────────────────┘
```

**Last Updated:** 2026-04-10  
**Backup Schedule:** 11 PM & 12 PM daily  
**Backup Retention:** 30 days  
**GitHub Repo:** https://github.com/ruland16/Openclaw.git