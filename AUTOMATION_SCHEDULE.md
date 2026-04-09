# AUTOMATION SCHEDULE

Defines daily and weekly routines for the agentic organization.

========================
DAILY (Run every morning at 08:00 EDT)
========================

## 1. Executive Sync (Lui)
**Time:** 08:00-08:30 EDT
**Purpose:** Coordinate daily priorities across all Chiefs
**Process:**
- Ping all Chiefs for status update
- Collect: Yesterday's achievements, Today's focus, Blockers, Synergy opportunities
- Update AGENT_STATUS.md with current status
- Update PROJECT_BOARD.md with progress
- Generate Executive Summary for user
**Output:** Daily organizational status report

## 2. Family Brief (June)
**Time:** 08:30-08:45 EDT  
**Purpose:** Manage personal life logistics and balance
**Process:**
- Review family calendar for day
- Check for appointments, school events, activities
- Identify potential business/personal conflicts
- Plan meals, errands, household tasks
- Update personal memory files
**Output:** Daily family logistics plan

## 3. YouTube Trend Scan (Buzz)
**Time:** 08:45-09:15 EDT
**Purpose:** Stay current with YouTube trends and opportunities
**Process:**
- Scan trending videos in relevant categories
- Analyze competitor channel updates
- Check YouTube Studio analytics for own channels
- Identify content opportunities based on trends
- Update content calendar if needed
**Output:** YouTube trend report and content recommendations

## 4. Shopify Metrics Check (Goldie)
**Time:** 09:15-09:45 EDT
**Purpose:** Monitor e-commerce performance and identify issues
**Process:**
- Check daily sales, conversion rates, traffic
- Review abandoned cart rates and recovery opportunities
- Monitor ad campaign performance
- Check inventory levels and fulfillment status
- Identify urgent issues requiring attention
**Output:** Shopify daily performance report

## 5. Opportunity Scan (Warren)
**Time:** 09:45-10:15 EDT
**Purpose:** Continuously identify new business opportunities
**Process:**
- Scan news, market trends, emerging technologies
- Check industry reports and investment theses
- Review competitor movements and market gaps
- Evaluate potential partnership opportunities
- Update opportunity pipeline
**Output:** Daily opportunity brief with 1-3 top findings

## 6. Technical Health Check (Elon)
**Time:** 10:15-10:45 EDT
**Purpose:** Ensure IT systems and projects are functioning
**Process:**
- Check system status and error logs
- Review IT project progress
- Monitor automation tool performance
- Identify technical debt or maintenance needs
- Update technical documentation
**Output:** Technical status report

## 7. Memory Morning Review (Brains)
**Time:** 10:45-11:00 EDT
**Purpose:** Start day with clean memory foundation
**Process:**
- Review previous day's memory entries
- Apply memory routing rules to new content
- Check central_memory.md line count
- Flag items for weekly pruning
- Ensure memory organization standards
**Output:** Memory hygiene status

========================
WEEKLY (Run every Sunday at 09:00 EDT)
========================

## 1. Memory Pruning (Brains)
**Time:** 09:00-10:00 EDT
**Purpose:** Maintain memory system health and organization
**Process:**
- Full review of central_memory.md
- Archive eligible entries to legacy_archive.md
- Prune distributed memory folders
- Update archive cross-references
- Verify line count compliance (<500 lines)
**Output:** Weekly memory audit report

## 2. PROJECT_BOARD.md Cleanup (Lui + Brains)
**Time:** 10:00-10:30 EDT
**Purpose:** Keep project tracking current and actionable
**Process:**
- Review all active projects for progress
- Move completed projects to Completed section
- Update statuses based on weekly progress
- Remove stale or obsolete backlog items
- Re-prioritize based on current objectives
**Output:** Updated PROJECT_BOARD.md

## 3. MEDIA_PIPELINE.md Review (Lens)
**Time:** 10:30-11:00 EDT
**Purpose:** Optimize video production workflow
**Process:**
- Analyze pipeline performance metrics
- Identify bottlenecks or inefficiencies
- Review improvement log for implementation
- Update templates and asset libraries
- Plan next week's production schedule
**Output:** Media pipeline optimization report

## 4. IT Project Audit (Elon)
**Time:** 11:00-11:30 EDT
**Purpose:** Ensure technical projects are on track
**Process:**
- Review all active IT project status
- Check code quality and technical debt
- Evaluate tool and technology effectiveness
- Plan technical improvements for coming week
- Update technical roadmap
**Output:** IT project audit report

## 5. Marketing Funnel Review (Goldie)
**Time:** 11:30-12:00 EDT
**Purpose:** Optimize marketing performance and conversion
**Process:**
- Analyze weekly marketing metrics
- Review funnel conversion rates at each stage
- Evaluate campaign ROI and effectiveness
- Plan marketing tests for coming week
- Update marketing strategy based on data
**Output:** Marketing performance and optimization report

## 6. Business Opportunity Ranking (Warren)
**Time:** 12:00-12:30 EDT
**Purpose:** Prioritize business opportunities for action
**Process:**
- Review all opportunities in pipeline
- Apply scoring model (market size, competition, fit, etc.)
- Rank opportunities by potential ROI
- Select top 3 for deeper evaluation
- Create action plans for top opportunities
**Output:** Weekly opportunity ranking and action plan

## 7. Personal Life Review (June)
**Time:** 12:30-13:00 EDT
**Purpose:** Maintain work-life balance and personal organization
**Process:**
- Review family schedule for coming week
- Plan meals, groceries, household maintenance
- Coordinate family activities and appointments
- Identify potential stress points or conflicts
- Update personal systems and routines
**Output:** Weekly personal life plan

## 8. Executive Weekly Planning (Lui)
**Time:** 13:00-13:30 EDT
**Purpose:** Set organizational priorities for coming week
**Process:**
- Consolidate all weekly reports
- Identify top 3 organizational priorities
- Allocate resources and assign responsibilities
- Schedule key meetings and deadlines
- Update central_memory.md with weekly plan
**Output:** Weekly organizational priority plan

========================
MONTHLY (First Monday of each month at 09:00 EDT)
========================

## 1. Strategic Review (Warren + Lui)
**Purpose:** Align monthly activities with long-term goals
**Process:**
- Review progress toward aircraft ownership goals
- Evaluate monthly financial performance
- Adjust strategies based on results
- Set monthly revenue and growth targets
**Output:** Monthly strategic alignment report

## 2. Financial Review (All Chiefs)
**Purpose:** Track progress toward wealth-building goals
**Process:**
- Review all income streams (YouTube, Shopify, etc.)
- Analyze expenses and profitability
- Update financial projections
- Adjust business priorities based on financial data
**Output:** Monthly financial performance report

## 3. Agent Performance Review (Lui)
**Purpose:** Ensure all Chiefs are effective and aligned
**Process:**
- Review each Chief's contribution to goals
- Identify training or skill development needs
- Adjust responsibilities if needed
- Set performance goals for next month
**Output:** Monthly agent performance assessment

========================
IMPLEMENTATION NOTES
========================

### Scheduling Technology:
- **OpenClaw Cron:** Use for time-based automation
- **Heartbeat System:** For checks that need conversational context
- **Manual Triggers:** Some routines may require user approval

### Exception Handling:
- **Missed Routines:** Automatically reschedule or run as soon as possible
- **Conflicting Priorities:** Lui adjusts schedule based on urgency
- **Resource Constraints:** Scale back if system load is high

### Performance Tracking:
- **Completion Rate:** % of scheduled routines completed on time
- **Effectiveness:** Impact of routines on organizational performance
- **Efficiency:** Time spent vs value generated
- **User Satisfaction:** Feedback on routine usefulness

### Customization:
- Schedule can be adjusted based on:
  - Current project priorities
  - User availability and preferences
  - Seasonal business patterns
  - System performance and capacity

---
**Schedule Created:** 2026-04-09
**Maintained by:** Lui (Orchestrator & COO)
**First Execution:** Next morning (2026-04-10 at 08:00 EDT)
**Review Frequency:** Monthly, or as organizational needs change