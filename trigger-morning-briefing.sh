#!/bin/bash
# Morning Briefing Trigger
# Creates a trigger file that Lui checks

echo "$(date -Iseconds)" > ~/.openclaw/workspace/memory/.morning-briefing-trigger
echo "Morning briefing triggered at $(date)" >> ~/.openclaw/workspace/memory/cron-log.txt
