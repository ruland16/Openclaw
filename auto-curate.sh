#!/bin/bash
# Twice-weekly MEMORY.md Auto-Curation Script
# Runs: Wednesdays and Sundays at 5am

export GEMINI_API_KEY="AIzaSyCc_hKozhulqm9fbt2NLE1tqqG6ejEORmc"
export PATH="/home/linuxbrew/.linuxbrew/bin:$PATH"
export PGUSER=openclaw
export PGPASSWORD=openclaw123
export PGHOST=localhost
export PGDATABASE=openclaw_memory

WORKSPACE="$HOME/.openclaw/workspace"
MEMORY_DIR="$WORKSPACE/memory"
LOG_FILE="$MEMORY_DIR/auto-curation.log"

echo "=== Auto-Curation Started: $(date) ===" >> "$LOG_FILE"

# Run the flush
/home/linuxbrew/.linuxbrew/bin/python3 "$WORKSPACE/skills/vector-memory/scripts/memory_flush.py" >> "$LOG_FILE" 2>&1

echo "=== Auto-Curation Completed: $(date) ===" >> "$LOG_FILE"
echo "" >> "$LOG_FILE"
