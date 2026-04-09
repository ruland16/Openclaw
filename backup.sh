#!/bin/bash
# OpenClaw Workspace Backup Script
# Run this manually or schedule with cron

set -e

WORKSPACE_DIR="/home/user/.openclaw/workspace"
BACKUP_DIR="/home/user/.openclaw-backups"
CONFIG_DIR="/home/user/.openclaw/config"
LOG_FILE="/home/user/.openclaw-backups/backup.log"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# Log function
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

log "Starting OpenClaw workspace backup..."

# 1. Git commit of workspace changes
cd "$WORKSPACE_DIR"
if git diff --quiet && git diff --cached --quiet; then
    log "No changes to commit in workspace."
else
    git add -A
    git commit -m "Auto-backup: $TIMESTAMP" || log "Warning: Git commit failed"
    log "Committed workspace changes."
fi

# 2. Create tar backup of workspace
BACKUP_FILE="$BACKUP_DIR/workspace_backup_$TIMESTAMP.tar.gz"
tar -czf "$BACKUP_FILE" -C "$WORKSPACE_DIR" . 2>/dev/null
log "Created workspace backup: $(basename "$BACKUP_FILE") ($(du -h "$BACKUP_FILE" | cut -f1))"

# 3. Backup config directory
CONFIG_BACKUP="$BACKUP_DIR/config_backup_$TIMESTAMP.tar.gz"
if [ -d "$CONFIG_DIR" ]; then
    tar -czf "$CONFIG_BACKUP" -C "$CONFIG_DIR" . 2>/dev/null
    log "Created config backup: $(basename "$CONFIG_BACKUP") ($(du -h "$CONFIG_BACKUP" | cut -f1))"
else
    log "Config directory not found: $CONFIG_DIR"
fi

# 4. Clean up old backups (keep last 30 days)
find "$BACKUP_DIR" -name "workspace_backup_*.tar.gz" -mtime +30 -delete 2>/dev/null || true
find "$BACKUP_DIR" -name "config_backup_*.tar.gz" -mtime +30 -delete 2>/dev/null || true
log "Cleaned up backups older than 30 days."

# 5. Show backup status
BACKUP_COUNT=$(find "$BACKUP_DIR" -name "*.tar.gz" | wc -l)
log "Backup completed. Total backups: $BACKUP_COUNT"
log "Backup location: $BACKUP_DIR"
log "Log file: $LOG_FILE"

echo "=== Backup Summary ==="
echo "Workspace: $WORKSPACE_DIR"
echo "Backups: $BACKUP_COUNT files in $BACKUP_DIR"
echo "Latest: $(ls -t "$BACKUP_DIR"/*.tar.gz 2>/dev/null | head -1 | xargs basename 2>/dev/null || echo "None")"
echo "Log: $LOG_FILE"