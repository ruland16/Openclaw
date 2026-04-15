# MEMORY.md - Lui's Curated Long-Term Memory

Last updated: 2026-04-14

## Memory System
- Daily notes: memory/YYYY-MM-DD.md - raw session logs, written automatically, load on-demand
- MEMORY.md: curated long-term brain - load every heartbeat (~3K tokens)
- projects.md: compact project registry - load every heartbeat (~1K tokens)
- Vector DB: PostgreSQL + pgvector ready at `/skills/vector-memory/` (needs install - see INSTALL.md)
- Smart loading: only projects.md + MEMORY.md at startup. Daily notes + vector search = on-demand only. Saves ~80% token cost vs loading everything.

## Agent Organization

### Active Chiefs
| Agent | Role | Model | Fallback |
|-------|------|-------|----------|
| **Lui** | COO/Orchestrator | kimi-k2.5:cloud | - |
| Warren | Strategy Chief | glm-5.1:cloud | qwen3.5:cloud |
| Brains | CMO | qwen3.5:cloud | - |
| Lens | Media Producer | qwen3.5:latest | qwen3.5:cloud |
| Elon | CTO | qwen3.5:cloud | minimax-m2.7:cloud |
| Buzz | CCO YouTube | qwen3.5:cloud | - |
| Goldie | Marketing Chief | gemma4:latest | glm-5.1:cloud |
| June | Personal Life Manager | gemma4:latest | glm-5.1:cloud |

### Local Models Status
- `gemma4:latest` (9.6GB): ✅ GPU-loaded, 100% acceleration, 32k context
- `qwen3.5:latest` (6.6GB): ✅ Ready for Lens

## Current Priorities

1. **Mission Control Dashboard** - Elon building standalone HTML file with gamification, meetings, intel, YouTube tabs
2. **Business Opportunity Scouting** - Warren's first idea: AI Slow Fashion Marketplace
3. **Memory System Upgrade** - Implementing smart loading (projects.md + MEMORY.md only)

## Key Decisions

- Use `mode=run` for subagent spawns (thread mode has no hooks registered on Telegram)
- Local models tested and working: gemma4 on GPU, cold start ~15-30s, cached 5min window
- Delegation over doing: Lui coordinates, Elon codes, Warren strategizes, etc.

## Lessons Learned

- Always spawn Elon with longer timeout (15min) for complex coding tasks
- Default 5min timeout too short for substantial work
- Use `trash` not `rm` for safety
- Daily notes are archives; load on-demand only

## Notes

- Russ prefers delegation over Lui doing technical work
- Local models confirmed working on GPU with full acceleration
- Mission Control dashboard inspired by Zach Babiarz video features
