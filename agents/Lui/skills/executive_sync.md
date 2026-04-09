# Skill: Executive Sync

**Owner:** Lui (Orchestrator & COO)
**Purpose:** Coordinate daily synchronization across all Chiefs, update status tracking, and provide user with actionable summary
**Frequency:** Daily (or as needed)
**Dependencies:** All Chiefs must be spawned and responsive

## 1. Ping All Chiefs

Initiate contact with each Chief in the organization:

### Leadership & Coordination
- **Brains (CMO)** - Memory Officer
- **Warren (Strategy)** - Strategy Chief

### Business Operations  
- **Elon (CTO)** - Technical Officer
- **Goldie (Marketing)** - Marketing Chief

### Content & Media
- **Buzz (YouTube)** - Creative Officer
- **Lens (Media)** - Media Producer

### Personal
- **June (Personal)** - Life Manager

**Method:** Use `sessions_send` to each Chief's session with standardized request format.

## 2. Request Template from Each Chief

Send this exact template to each Chief:

```
## Executive Sync Request - [Date]

Please provide:
1. **Yesterday's Achievements:** What did you accomplish?
2. **Today's Focus:** What are your top 1-3 priorities today?
3. **Blockers:** Any obstacles preventing progress?
4. **Cross-Department Synergy:** Opportunities to collaborate with other Chiefs?
5. **Resource Needs:** Anything you need from me or other Chiefs?

Reply format:
- Achievements: [bullet points]
- Focus: [bullet points]  
- Blockers: [bullet points or "None"]
- Synergy: [specific suggestions with other Chiefs]
- Needs: [bullet points or "None"]
```

## 3. Collect and Process Responses

Wait for responses from all Chiefs (timeout: 5 minutes per Chief).
For unresponsive Chiefs, mark as "No Response" in status.

**Processing Steps:**
1. Extract key information from each response
2. Identify common themes and patterns
3. Note urgent blockers requiring immediate attention
4. Highlight cross-department collaboration opportunities

## 4. Update AGENT_STATUS.md

Update each Chief's section in AGENT_STATUS.md:

```
========================
[Chief Name] ([Role])
========================
Status: [Active/Blocked/Unresponsive]
Focus: [Today's focus from response]
Blockers: [Blockers from response or "None"]
Notes: 
- [Key achievements from yesterday]
- [Synergy opportunities identified]
- [Resource needs]
- [Last updated: timestamp]
```

## 5. Update PROJECT_BOARD.md

Review responses for project-related updates:

**For each project mentioned:**
- Update status if changed (Not Started → In Progress, etc.)
- Add new tasks to Backlog if identified
- Move completed tasks to Completed section
- Update deadlines if new information provided
- Add notes about progress or blockers

**Add new projects** if Chiefs identify new initiatives.

## 6. Generate Executive Summary Report

Create a consolidated report for the user:

### Executive Sync Summary - [Date]

**Top 3 Organizational Priorities for Today:**
1. [Priority 1 - from most urgent/important across all Chiefs]
2. [Priority 2 - second most important]
3. [Priority 3 - third most important]

**Critical Risks & Blockers:**
- [Blocker 1 - with Chief responsible and impact]
- [Blocker 2 - with Chief responsible and impact]
- [Additional blockers as needed]

**Decisions Needed from You:**
1. [Decision 1 - clear question with context]
2. [Decision 2 - clear question with context]
3. [Additional decisions as needed]

**Cross-Department Synergy Opportunities:**
- [Opportunity 1 - which Chiefs, what collaboration, expected benefit]
- [Opportunity 2 - which Chiefs, what collaboration, expected benefit]
- [Additional opportunities as needed]

**Quick Status by Department:**
- **YouTube:** [Buzz status summary]
- **Shopify:** [Goldie status summary]  
- **IT/Technical:** [Elon status summary]
- **Strategy:** [Warren status summary]
- **Personal:** [June status summary]
- **Memory/Coordination:** [Brains/Lui status summary]

**Recommended Actions:**
1. [Action 1 for user]
2. [Action 2 for user]
3. [Action 3 for user]

## 7. Deliver Summary to User

Send the Executive Summary Report to the user via the current channel.

**Include:** Clear formatting, bullet points for readability, and emoji indicators for urgency (🚨 for blockers, ✅ for achievements, 🤝 for synergy).

**Follow-up:** Note any requested decisions or actions for tracking in next sync.

## 8. Schedule Next Sync

Based on urgency and workload:
- **Daily:** If multiple active projects or tight deadlines
- **Every 2-3 days:** If steady state with few blockers
- **Weekly:** If minimal activity or waiting on external factors

Update central_memory.md with sync frequency decision.

## Troubleshooting

**If a Chief is unresponsive:**
1. Check if their session is still active
2. Attempt re-ping with shorter timeout
3. If still unresponsive, note in status and proceed without their input
4. Consider respawning their session if critical

**If responses are incomplete:**
1. Send follow-up for missing sections
2. Use previous day's information as fallback
3. Mark as "Partial Response" in status

**If too many blockers identified:**
1. Prioritize by impact on organizational goals
2. Escalate only critical blockers to user
3. Create action plan for addressing others internally

## Success Metrics

- **Response Rate:** >80% of Chiefs respond within timeout
- **Update Completeness:** AGENT_STATUS.md and PROJECT_BOARD.md fully updated
- **User Actionability:** Summary leads to clear decisions/actions
- **Blockers Resolved:** >50% of identified blockers addressed before next sync

---
**Skill Created:** 2026-04-09
**Last Updated:** 2026-04-09
**Maintained by:** Lui (Orchestrator & COO)