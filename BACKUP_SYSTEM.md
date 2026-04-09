# OpenClaw Backup System

## Overview
This backup system protects your OpenClaw workspace, agent configurations, and memory files. It provides both version control (git) and file-level backups.

## Components

### 1. Git Repository
- **Location:** `/home/user/.openclaw/workspace/`
- **Purpose:** Version control for configuration files and documentation
- **Auto-commit:** Backup script automatically commits changes
- **Ignore:** Sensitive files excluded via `.gitignore`

### 2. File Backups
- **Location:** `/home/user/.openclaw-backups/`
- **Frequency:** Manual or scheduled via cron
- **Retention:** 30 days
- **Contents:**
  - Workspace directory (compressed tar.gz)
  - Config directory (if exists)

### 3. Backup Scripts
- `backup.sh` - Creates backups and commits git changes
- `restore.sh` - Interactive restore from backup
- Both scripts are executable and self-documenting

## Usage

### Manual Backup
```bash
cd /home/user/.openclaw/workspace
./backup.sh
```

### Scheduled Backup (cron)
Add to crontab for daily backup at 2 AM:
```bash
0 2 * * * /home/user/.openclaw/workspace/backup.sh
```

### Restore from Backup
```bash
cd /home/user/.openclaw/workspace
./restore.sh
```

## What Gets Backed Up

### ✅ Included:
- Agent configurations (SOUL.md, USER.md, etc.)
- Organization structure (ORGANIZATION.md, AGENT_STATUS.md)
- Memory files (central_memory.md, memory/*.md)
- Project documentation
- Backup scripts themselves

### ❌ Excluded (via .gitignore):
- Sensitive credentials (auth-profiles.json)
- Runtime cache and logs
- Temporary files
- Node modules

## Recovery Scenarios

### 1. Accidental File Deletion
```bash
cd /home/user/.openclaw/workspace
git checkout -- <file>
```

### 2. Corrupted Workspace
```bash
cd /home/user/.openclaw/workspace
./restore.sh
```

### 3. Full System Recovery
1. Install OpenClaw fresh
2. Run `./restore.sh` from backup directory
3. Configure any missing credentials

## Best Practices

1. **Run backup before major changes** - Before modifying agent configurations or organization structure
2. **Test restore periodically** - Ensure backups are working
3. **Keep credentials separate** - Never commit auth-profiles.json to git
4. **Monitor backup logs** - Check `/home/user/.openclaw-backups/backup.log`

## Integration with Multi-Agent System

- **Lui (COO):** Can trigger backups via executive sync
- **Brains (CMO):** Responsible for memory file integrity
- **Elon (CTO):** Can enhance backup system with automation

## Next Enhancements
1. Cloud backup integration (AWS S3, Google Drive)
2. Incremental backups for large memory files
3. Backup health monitoring dashboard
4. Automated restore testing

---
**Maintained by:** Lui (COO)
**Last Updated:** 2026-04-09
**Backup Location:** `/home/user/.openclaw-backups/`