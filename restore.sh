#!/bin/bash
# OpenClaw Workspace Restore Script

set -e

WORKSPACE_DIR="/home/user/.openclaw/workspace"
BACKUP_DIR="/home/user/.openclaw-backups"
CONFIG_DIR="/home/user/.openclaw/config"

echo "=== OpenClaw Workspace Restore ==="
echo ""

# List available backups
echo "Available workspace backups:"
ls -lt "$BACKUP_DIR"/workspace_backup_*.tar.gz 2>/dev/null | head -10 | awk '{print NR ": " $9}' || echo "No backups found."

echo ""
read -p "Enter backup number to restore (or 'q' to quit): " CHOICE

if [ "$CHOICE" = "q" ]; then
    echo "Restore cancelled."
    exit 0
fi

# Get selected backup file
BACKUP_FILE=$(ls -t "$BACKUP_DIR"/workspace_backup_*.tar.gz 2>/dev/null | sed -n "${CHOICE}p")

if [ -z "$BACKUP_FILE" ] || [ ! -f "$BACKUP_FILE" ]; then
    echo "Invalid selection or backup not found."
    exit 1
fi

echo ""
echo "Selected backup: $(basename "$BACKUP_FILE")"
echo "Size: $(du -h "$BACKUP_FILE" | cut -f1)"
echo "Date: $(stat -c %y "$BACKUP_FILE")"
echo ""

# Confirm restore
read -p "WARNING: This will overwrite current workspace. Continue? (y/N): " CONFIRM
if [ "$CONFIRM" != "y" ] && [ "$CONFIRM" != "Y" ]; then
    echo "Restore cancelled."
    exit 0
fi

# Create backup of current state before restore
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
PRE_RESTORE_BACKUP="$BACKUP_DIR/pre_restore_$TIMESTAMP.tar.gz"
tar -czf "$PRE_RESTORE_BACKUP" -C "$WORKSPACE_DIR" . 2>/dev/null
echo "Created pre-restore backup: $(basename "$PRE_RESTORE_BACKUP")"

# Restore workspace
echo "Restoring workspace..."
cd "$WORKSPACE_DIR"
rm -rf ./* 2>/dev/null || true
tar -xzf "$BACKUP_FILE"
echo "Workspace restored from: $(basename "$BACKUP_FILE")"

# Check for config backup
CONFIG_BACKUP="${BACKUP_FILE/workspace_backup_/config_backup_}"
if [ -f "$CONFIG_BACKUP" ]; then
    echo ""
    read -p "Found matching config backup. Restore config too? (y/N): " RESTORE_CONFIG
    if [ "$RESTORE_CONFIG" = "y" ] || [ "$RESTORE_CONFIG" = "Y" ]; then
        if [ -d "$CONFIG_DIR" ]; then
            CONFIG_BACKUP_PRE="$BACKUP_DIR/config_pre_restore_$TIMESTAMP.tar.gz"
            tar -czf "$CONFIG_BACKUP_PRE" -C "$CONFIG_DIR" . 2>/dev/null
            echo "Created pre-restore config backup: $(basename "$CONFIG_BACKUP_PRE")"
            
            rm -rf "$CONFIG_DIR"/* 2>/dev/null || true
            tar -xzf "$CONFIG_BACKUP" -C "$CONFIG_DIR"
            echo "Config restored from: $(basename "$CONFIG_BACKUP")"
        else
            echo "Config directory not found: $CONFIG_DIR"
        fi
    fi
fi

echo ""
echo "=== Restore Complete ==="
echo "Workspace: $WORKSPACE_DIR"
echo "Restored from: $(basename "$BACKUP_FILE")"
echo "Pre-restore backup: $(basename "$PRE_RESTORE_BACKUP")"
echo ""
echo "Next steps:"
echo "1. Review restored files"
echo "2. Restart OpenClaw if needed"
echo "3. Test agent functionality"