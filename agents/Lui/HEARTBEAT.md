# HEARTBEAT.md

## SMART MEMORY LOADING (do this first, every heartbeat)
Before anything else, load context efficiently:
1. Read memory/projects.md - compact project registry (~1K tokens)
2. Read MEMORY.md - curated long-term memory (~3K tokens)
3. Only load daily notes (memory/YYYY-MM-DD.md) when asked about specific past work
4. Only run vector search when a specific question about past work comes up

This gives full context at ~10% of the token cost. Daily notes are archives, not runtime docs.

---

# Keep this file empty (or with only comments) to skip heartbeat API calls.

# Add tasks below when you want the agent to check something periodically.

## Vector Memory Flush (every heartbeat)
Run: python3 ~/.openclaw/workspace/skills/vector-memory/scripts/memory_flush.py
If total_stored = 0, that is fine - means nothing new to embed.

## Daily Morning Briefing (9 AM)
**Trigger Method:** Cron creates `.morning-briefing-trigger` file at 9:00 AM
**My Action:** Check for trigger file during first heartbeat after 9 AM
1. If trigger file exists: Generate briefing immediately and delete trigger
2. Collect reports from all Chiefs
3. Compile and send briefing to Russ
4. Include June's flight tracking report

## June's Daily Tasks
1. Check flight prices: Atlanta → Moscow (3 adults, flexible dates July 14-Aug 15)
2. Analyze alternative routes: Charlotte → Moscow via ATL/MIA/NYC/DC
3. Report cheapest and fastest options
4. Update flight tracking spreadsheet
5. Flag any significant price drops or deals
```
