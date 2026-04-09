# AGENT COLLABORATION PROTOCOL

Defines how agents communicate and collaborate.

========================
COMMUNICATION RULES
========================

## 1. Central Coordination Through Lui
**Rule:** All inter‑agent communication goes through Lui for coordination
**Purpose:** Ensure alignment, prevent conflicts, maintain organizational awareness
**Application:**
- **Initial Contact:** Chiefs contact Lui first for any inter-department collaboration
- **Request Format:** Use standardized collaboration request template
- **Lui's Role:** Matchmake appropriate Chiefs, define scope, set expectations
- **Tracking:** Lui logs all collaborations in central_memory.md
- **Exception:** Direct communication allowed for ongoing collaborations after Lui introduction

**Collaboration Request Template:**
```
**Collaboration Request**
**From:** [Requesting Chief]
**To:** Lui (for routing)
**Date:** [YYYY-MM-DD]

**Collaboration Need:**
[Brief description of why collaboration is needed]

**Desired Partners:**
[Which Chiefs would be helpful? Buzz, Lens, Elon, Goldie, Warren, June, Brains]

**Expected Outcome:**
[What should this collaboration achieve?]

**Timeframe:**
[Urgent (today), Soon (this week), Planning (next week)]

**Resources Needed:**
[Any special tools, information, or support required]

**Success Metrics:**
[How will we know this collaboration was successful?]
```

## 2. Sub‑Agent Management
**Rule:** Chiefs may request sub‑agents as needed for specialized tasks
**Purpose:** Enable scalable execution without overloading Chiefs
**Application:**
- **Request Process:** Chief → Lui → Sub-agent creation
- **Scope Definition:** Clear deliverables, timeline, and success criteria
- **Oversight:** Requesting Chief maintains responsibility for sub-agent work
- **Resource Management:** Lui tracks sub-agent usage to prevent overload
- **Sunsetting:** Sub-agents automatically terminate when task complete

**Sub-Agent Request Template:**
```
**Sub-Agent Request**
**From:** [Requesting Chief]
**To:** Lui
**Date:** [YYYY-MM-DD]

**Task Description:**
[Specific, bounded task for sub-agent]

**Required Skills:**
[Technical, creative, analytical, etc.]

**Duration Estimate:**
[Hours/days expected]

**Success Deliverables:**
[Concrete outputs expected]

**Integration Plan:**
[How results will be incorporated into Chief's work]
```

## 3. Memory Consistency Monitoring
**Rule:** Brains monitors memory consistency across all agents
**Purpose:** Ensure unified knowledge base, prevent information silos
**Application:**
- **Memory Audits:** Brains reviews all agent memory folders weekly
- **Consistency Checks:** Verify related information aligns across departments
- **Conflict Resolution:** Brains flags memory conflicts for Lui to resolve
- **Knowledge Sharing:** Brains identifies insights that should be shared across departments
- **Archive Management:** Brains ensures proper archival of historical information

**Memory Consistency Report Template:**
```
**Memory Consistency Report**
**From:** Brains (CMO)
**To:** All Chiefs via Lui
**Date:** [YYYY-MM-DD]

**Areas of Alignment:**
[Where agent memories agree and reinforce each other]

**Areas of Divergence:**
[Where conflicting information exists]

**Recommended Actions:**
[Specific steps to resolve inconsistencies]

**Cross-Department Insights:**
[Knowledge from one department that could benefit others]
```

## 4. Content Creation Coordination
**Rule:** Lens and Buzz coordinate on content production
**Purpose:** Ensure seamless script-to-video workflow
**Application:**
- **Workflow:** Buzz (concept/script) → Lens (production) → Buzz (publishing/optimization)
- **Handoff Protocol:** Standardized MEDIA_PIPELINE.md process
- **Feedback Loops:** Structured review cycles with clear criteria
- **Asset Management:** Shared libraries of templates, graphics, music
- **Performance Review:** Joint analysis of content performance data

**Content Coordination Template:**
```
**Content Coordination Request**
**From:** Buzz (or Lens)
**To:** Lens (or Buzz) via Lui
**Date:** [YYYY-MM-DD]

**Project:** [Video title or content piece]

**Current Stage:**
[Concept, Script, Production, Editing, Publishing, Analysis]

**Action Needed:**
[What specific collaboration is required?]

**Assets Provided:**
[Script, rough cut, graphics, data, etc.]

**Feedback Requested:**
[Specific areas for input or approval]

**Timeline:**
[When response/action needed]
```

## 5. Marketing Coordination
**Rule:** Goldie and Buzz coordinate on marketing initiatives
**Purpose:** Align content creation with marketing strategy
**Application:**
- **Campaign Planning:** Joint development of content-marketing campaigns
- **Audience Alignment:** Ensure content targets same audiences as marketing
- **Performance Integration:** Combine YouTube analytics with marketing data
- **Promotion Strategy:** Coordinate video releases with marketing pushes
- **Monetization Alignment:** Ensure content supports e-commerce goals

**Marketing Coordination Template:**
```
**Marketing Coordination Request**
**From:** Goldie (or Buzz)
**To:** Buzz (or Goldie) via Lui
**Date:** [YYYY-MM-DD]

**Initiative:** [Campaign name or marketing effort]

**Objective:**
[Sales, leads, awareness, engagement, etc.]

**Content Needs:**
[Specific videos, posts, or content required]

**Timeline:**
[Key dates for content delivery and promotion]

**Success Metrics:**
[How we'll measure effectiveness]

**Resource Allocation:**
[Budget, tools, or support needed]
```

## 6. Opportunity Sharing
**Rule:** Warren shares opportunities with all Chiefs
**Purpose:** Ensure organization leverages all identified opportunities
**Application:**
- **Weekly Brief:** Warren distributes opportunity pipeline update
- **Relevance Filtering:** Warren tailors opportunities to each Chief's domain
- **Collaboration Identification:** Warren suggests which Chiefs should collaborate on opportunities
- **Validation Support:** Chiefs provide domain expertise for opportunity validation
- **Execution Handoff:** Validated opportunities transition from Warren to appropriate Chiefs

**Opportunity Sharing Template:**
```
**Opportunity Brief**
**From:** Warren (Strategy Chief)
**To:** [Specific Chief or All Chiefs] via Lui
**Date:** [YYYY-MM-DD]

**Opportunity:** [Brief title]

**Summary:**
[One-paragraph description]

**Relevance to You:**
[Why this matters for your domain]

**Validation Status:**
[Early research, 7-day test planned, validated, etc.]

**Potential Collaboration:**
[Other Chiefs who might be involved]

**Next Steps Suggested:**
[What you might do with this opportunity]

**Questions for You:**
[Your expertise needed for validation/execution]
```

========================
ESCALATION RULES
========================

## 1. Blocker Escalation
**Rule:** Blockers → escalate to Lui
**Purpose:** Ensure impediments are resolved quickly
**Application:**
- **Definition:** Anything preventing progress on priority work
- **Timing:** Escalate after 4 hours of unsuccessful resolution attempt
- **Format:** Use standardized blocker escalation template
- **Lui's Role:** Coordinate resources, make decisions, or escalate to User
- **Follow-up:** Regular updates until blocker resolved

**Blocker Escalation Template:**
```
**Blocker Escalation**
**From:** [Blocked Chief]
**To:** Lui
**Date:** [YYYY-MM-DD]
**Urgency:** [High/Medium/Low]

**Blocker Description:**
[What is preventing progress?]

**Impact:**
[How this affects timelines, goals, or other work]

**Attempted Solutions:**
[What you've tried already]

**Recommended Resolution:**
[Your suggested way forward]

**Resources Needed:**
[What would help resolve this?]

**Timeline Impact:**
[How long can we wait before this becomes critical?]
```

## 2. Conflict Escalation
**Rule:** Conflicts → escalate to Lui
**Purpose:** Resolve disagreements before they impact work
**Application:**
- **Definition:** Disagreement on approach, priorities, or resources
- **Timing:** Escalate after 2 hours of unsuccessful resolution attempt
- **Format:** Use standardized conflict escalation template
- **Lui's Role:** Mediate, make binding decisions, or escalate to User
- **Documentation:** Conflicts and resolutions documented for organizational learning

**Conflict Escalation Template:**
```
**Conflict Escalation**
**From:** [Chief involved in conflict]
**To:** Lui
**Date:** [YYYY-MM-DD]

**Parties Involved:**
[Which Chiefs are in conflict?]

**Nature of Conflict:**
[What is the disagreement about?]

**Each Party's Position:**
[Brief summary of each perspective]

**Attempted Resolution:**
[What has been tried to resolve this?]

**Impact if Unresolved:**
[How this affects work and organization]

**Suggested Resolution:**
[Your recommendation for resolving]
```

## 3. Memory Issue Escalation
**Rule:** Memory issues → escalate to Brains
**Purpose:** Ensure memory system integrity
**Application:**
- **Definition:** Problems with memory access, organization, or consistency
- **Timing:** Escalate immediately upon discovery
- **Format:** Use standardized memory issue template
- **Brains' Role:** Investigate, resolve, and prevent recurrence
- **System Improvement:** Memory issues trigger process improvements

**Memory Issue Escalation Template:**
```
**Memory Issue Escalation**
**From:** [Chief discovering issue]
**To:** Brains (CMO)
**Date:** [YYYY-MM-DD]

**Issue Type:**
[Access problem, inconsistency, organization, duplication, etc.]

**Specific Problem:**
[Detailed description of the issue]

**Location:**
[Which memory file or folder?]

**Impact:**
[How this affects work or decision making]

**Reproduction Steps:**
[How to see the issue]

**Suggested Fix:**
[If you have ideas for resolution]
```

## 4. Emergency Escalation
**Rule:** Critical issues → escalate directly to User
**Purpose:** Handle time-sensitive or high-impact problems
**Application:**
- **Definition:** Issues that could cause significant financial loss, system failure, or reputational damage
- **Timing:** Immediate escalation, bypass normal chain
- **Criteria:** Use only for truly critical situations
- **Follow-up:** Inform Lui after emergency contact
- **Documentation:** Complete incident report after resolution

**Emergency Criteria:**
- System security breach or data loss
- Financial loss exceeding $1,000
- Legal or compliance violation
- Critical system failure affecting multiple Chiefs
- Any issue requiring User attention within 1 hour

========================
COLLABORATION SUCCESS METRICS
========================

## Communication Effectiveness:
- **Response Time:** Average time to acknowledge collaboration requests
- **Resolution Rate:** % of collaborations achieving desired outcomes
- **Satisfaction Score:** Participant feedback on collaboration experience
- **Efficiency:** Time spent collaborating vs value created

## Escalation Management:
- **Time to Resolution:** Average time from escalation to resolution
- **Recurrence Rate:** % of issues that recur after resolution
- **Appropriate Escalation:** % of escalations that were truly necessary
- **User Burden:** Frequency of unnecessary User escalations

## Cross-Department Synergy:
- **Collaboration Frequency:** Number of inter-department collaborations
- **Innovation Rate:** New ideas generated through collaboration
- **Problem Solving:** Complex problems solved through collaboration
- **Knowledge Transfer:** Insights shared across department boundaries

========================
PROTOCOL IMPLEMENTATION
========================

## Training & Onboarding:
- All new agents trained on COLLAB_PROTOCOL.md
- Quarterly protocol review during executive sync
- Success stories of effective collaboration shared
- Protocol violations used as learning opportunities

## Continuous Improvement:
- Monthly review of collaboration effectiveness
- Protocol adjustments based on performance data
- Feedback collection from all Chiefs on protocol usefulness
- Integration with other systems (PROJECT_BOARD.md, AGENT_STATUS.md)

## Technology Support:
- Template automation in agent communication tools
- Collaboration tracking in central systems
- Escalation workflow automation
- Performance metric dashboards

---
**Protocol Created:** 2026-04-09
**Maintained by:** Lui (with input from all Chiefs)
**Effective Date:** Immediately
**Review Schedule:** Monthly during executive sync
**Compliance Required:** All agents must follow protocol for effective collaboration