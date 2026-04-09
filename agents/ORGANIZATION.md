# ORGANIZATION.md - Multi-Agent Organization Structure

## Overview
Established: 2026-04-09
Orchestrator: Lui (COO)
Total Agents: 8

## Agent Directory Structure
```
/home/user/.openclaw/workspace/agents/
├── Lui/                    # Orchestrator / COO (Leader)
│   ├── soul.md
│   ├── skills/
│   └── memory/
├── Brains/                 # Chief Memory Officer
│   ├── soul.md
│   ├── skills/
│   └── memory/
├── Buzz/                   # Chief Creative Officer (YouTube)
│   ├── soul.md
│   ├── skills/
│   └── memory/
├── Lens/                   # Media Producer
│   ├── soul.md
│   ├── skills/
│   └── memory/
├── Elon/                   # Chief Technical Officer
│   ├── soul.md
│   ├── skills/
│   └── memory/
├── Goldie/                 # Marketing Chief
│   ├── soul.md
│   ├── skills/
│   └── memory/
├── Warren/                 # Strategy Chief
│   ├── soul.md
│   ├── skills/
│   └── memory/
└── June/                   # Personal Life Manager
    ├── soul.md
    ├── skills/
    └── memory/
```

## Agent Configuration Summary

| Agent | Role | Model | Focus |
|-------|------|-------|-------|
| Lui | Orchestrator / COO (Leader) | DeepSeek (deepseek/deepseek-chat) | Task routing, executive sync, coordination |
| Brains | Chief Memory Officer | DeepSeek (deepseek/deepseek-chat) | Memory hygiene, structure, archival |
| Buzz | Chief Creative Officer (YouTube) | DeepSeek (deepseek/deepseek-chat) | Content strategy, creation, audience growth |
| Lens | Media Producer | DeepSeek (deepseek/deepseek-chat) | Technical execution, editing, automation |
| Elon | Chief Technical Officer | DeepSeek (deepseek/deepseek-chat) | Technical innovation, rapid prototyping |
| Goldie | Marketing Chief | DeepSeek (deepseek/deepseek-chat) | E-commerce, marketing, revenue growth |
| Warren | Strategy Chief | DeepSeek (deepseek/deepseek-chat) | Long-term strategy, value evaluation |
| June | Personal Life Manager | DeepSeek (deepseek/deepseek-chat) | Health, relationships, personal organization |

## Communication Flow
1. **User → Lui**: All user requests flow through Lui (primary interface)
2. **Lui → Chiefs**: Lui routes tasks to appropriate Chiefs based on expertise
3. **Chiefs → Sub-agents**: Chiefs may spawn sub-agents for specialized work
4. **Executive Sync**: Daily morning sync coordinated by Lui
5. **Memory Flow**: All agents → CMO → central memory system

## Key Processes
1. **Daily Executive Sync** (09:00 EDT)
   - Each Chief reports: yesterday's progress, today's focus, blockers
   - Lui compiles report for user
   - Cross-department opportunities identified

2. **Weekly Memory Audit** (Mondays, 09:00 EDT)
   - CMO reviews all agent logs
   - Extracts important decisions and lessons
   - Prunes noise and maintains memory hygiene

3. **Project Board Updates** (Continuous)
   - Lui maintains PROJECT_BOARD.md
   - All Chiefs update their task status
   - Single source of truth for initiatives

## Sub-Agent Templates
- **SUB_AGENT_TEMPLATES.md** created with 6 specialized templates:
  1. Code Reviewer (for Elon)
  2. Content Variant Generator (for Buzz)
  3. Media Pipeline Auditor (for Lens)
  4. Marketing Experiment Designer (for Goldie)
  5. Opportunity Validator (for Warren)
  6. Personal Project Planner (for June)

## Initialization Status
- ✅ Directory structure created
- ✅ Soul.md files created for all agents
- ✅ Memory folders created for all agents
- ✅ Skills folders created for all agents
- ✅ Organization documentation created
- ✅ Sub-agent templates created
- ✅ All soul.md files updated with detailed specifications

## Next Steps
1. Initialize agent sessions (spawn each Chief)
2. Establish first executive sync
3. Create initial project board
4. Set up memory audit schedule
5. Configure model routing for each agent
6. Test sub-agent spawning workflows