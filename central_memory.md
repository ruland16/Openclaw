# CENTRAL MEMORY

This file stores long‑term knowledge, decisions, preferences, and cross‑department insights. 
Maintained by Brains (CMO). 
Kept under 500 lines. Older content goes to legacy_archive.md.

========================
USER PREFERENCES
========================
(Communication style, priorities, constraints — to be added later)

========================
LONG‑TERM GOALS
========================
(High‑level goals across YouTube, Shopify, IT, business, personal)

========================
AGENT ROLES & RESPONSIBILITIES
========================

## Leadership Team
1. **Lui** - Orchestrator & COO (Leader) (DeepSeek)
   - Primary interface, task routing, executive sync
   - Coordinates all agents and ensures organizational alignment

2. **Brains** - Chief Memory Officer (Gemma 4)
   - Memory hygiene, structure, archival
   - Maintains central_memory.md and legacy_archive.md
   - Weekly audits and cross-agent knowledge sync

3. **Warren** - Strategy Chief (DeepSeek)
   - Long-term strategy, value evaluation
   - Opportunity scouting with business theses and validation plans

## Business Operations
4. **Elon** - Chief Technical Officer (Gemma 4)
   - Technical innovation, rapid prototyping
   - Code review, tooling, and IT project guidance
   - Dishwasher Management App and other IT projects

5. **Goldie** - Marketing Chief (Qwen 3.5)
   - Shopify store optimization, marketing, revenue growth
   - Campaigns, analytics, and marketing automation

## Content & Media
6. **Buzz** - Chief Creative Officer (YouTube) (Qwen 3.5)
   - YouTube content strategy, audience growth
   - Focus on reviving 2 existing channels with monetization strategy
   - DJ Detective Content Pipeline

7. **Lens** - Media Producer (Gemma 4)
   - Technical execution, editing, automation
   - Pipeline orchestration with tool/skill usage focus

## Personal
8. **June** - Personal Life Manager (Qwen 3.5)
   - Health, relationships, work-life balance
   - Family logistics for 7-person NC family
   - Home maintenance and personal organization

========================
KEY DECISIONS
========================

### 2026-04-09: Multi-Agent Organization Creation
- **Decision:** Create full 8-agent organization with specialized roles
- **Rationale:** Distributed expertise across domains for comprehensive coverage
- **Impact:** Each domain (YouTube, Shopify, IT, Strategy, Personal) has dedicated Chief

### 2026-04-09: Model Assignments
- **Decision:** Assign DeepSeek to Lui and Warren for coordination/strategy
- **Rationale:** DeepSeek provides better coordination capabilities for leadership roles
- **Decision:** Use local models (Gemma 4, Qwen 3.5) for specialized domain work
- **Rationale:** Leverage local inference for cost efficiency and privacy

### 2026-04-09: Ollama Auth Configuration
- **Decision:** Configure Ollama authentication for local model agents
- **Action:** Added Ollama auth profiles to agent configurations
- **Impact:** Local models (Gemma 4, Qwen 3.5) now properly authenticated
- **Models restored:**
  - Brains, Lens, Elon → Gemma 4 (local)
  - Buzz, Goldie, June → Qwen 3.5 (local)
  - Lui, Warren → DeepSeek (cloud)

### 2026-04-09: Backup System Creation
- **Decision:** Implement comprehensive backup system for OpenClaw workspace
- **Rationale:** Protect against data loss from configuration changes or system failures
- **Components:** Git repository + file backups + restore scripts
- **Location:** `/home/user/.openclaw-backups/` with 30-day retention
- **Impact:** All agent configurations and memory files now protected with version control

### 2026-04-09: Agent Renaming
- **Decision:** Rename all agents with personality-driven codenames
- **Rationale:** More memorable names for better team identification and collaboration
- **Impact:** cmo → Brains, cco_youtube → Buzz, media_producer → Lens, etc.

### 2026-04-09: Gateway Configuration
- **Decision:** Resolve gateway pairing and enable local operation
- **Rationale:** Required for multi-agent spawning and system functionality
- **Impact:** Device approved: efc7368b00da1489375e4cf595a413374da9d704a9deabc48d49a4bcc10aea6f

========================
CROSS‑DEPARTMENT INSIGHTS
========================

### YouTube + Shopify Synergy
- **Insight:** YouTube content can drive traffic to Shopify store
- **Action:** Buzz (YouTube) and Goldie (Shopify) should coordinate content-commerce integration
- **Potential:** Product placements, channel sponsorships, affiliate marketing

### IT + Business Development Integration
- **Insight:** Technical innovation enables new business opportunities
- **Action:** Elon (CTO) and Warren (Strategy) should collaborate on tech-enabled ventures
- **Potential:** Dishwasher Management App could be first product in new business line

### Personal + Professional Balance
- **Insight:** Personal well-being impacts professional performance
- **Action:** June (Life Manager) should provide insights to all Chiefs on work-life integration
- **Potential:** Healthier, more sustainable work patterns across organization

========================
PROCESSES & ROUTINES
========================

### Daily Operations
- **Executive Sync:** Lui coordinates daily status updates (to be established)
- **Memory Maintenance:** Brains reviews memory files for hygiene
- **Project Updates:** All Chiefs update PROJECT_BOARD.md with progress

### Weekly Routines
- **Memory Audit:** Brains conducts weekly audit every Monday at 09:00 EDT
- **Executive Review:** Lui leads weekly review of all projects and priorities
- **Archive Rotation:** Older content moved to legacy_archive.md

### Content Pipeline (YouTube)
- **Planning:** Buzz develops content calendar and strategy
- **Production:** Lens executes technical production and editing
- **Publication:** Buzz manages publishing and audience engagement

### Shopify Operations
- **Store Management:** Goldie oversees daily store operations
- **Marketing Campaigns:** Goldie plans and executes marketing initiatives
- **Technical Integration:** Elon provides technical support for store features

========================
KNOWN CONSTRAINTS
========================

### Technical Constraints
- **Local Models Only:** Currently using local inference (Gemma 4, Qwen 3.5, DeepSeek)
- **Gateway Dependency:** All agent spawning requires functioning gateway
- **Memory Limits:** central_memory.md kept under 500 lines

### Resource Constraints
- **Agent Capacity:** 8-agent maximum in current configuration
- **Processing Power:** Local inference limited by available hardware
- **Time Zones:** Operations based on EDT (America/New_York)

### Operational Constraints
- **Manual Initialization:** Agent sessions require manual spawning
- **Memory Hygiene:** Requires weekly audits to prevent duplication/decay
- **Cross-Agent Coordination:** Executive sync process not yet established

========================
ARCHIVE POINTERS
========================

### legacy_archive.md Contains:
- Detailed timeline of 2026-04-09 organizational creation
- Full audit reports from CMO initial review
- Complete model update history
- Agent renaming documentation
- Gateway pairing resolution details

### Memory Logs:
- Daily activity logs in memory/YYYY-MM-DD.md
- Audit summaries in memory/CMO_AUDIT_SUMMARY_*.md
- Project-specific documentation in relevant directories

---
**Maintained by:** Brains (CMO)
**Last Updated:** 2026-04-09
**Next Audit:** 2026-04-16 (Monday, 09:00 EDT)
**Line Count:** [To be monitored by Brains]