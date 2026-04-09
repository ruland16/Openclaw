# Skill: Routing Rules

**Owner:** Lui (Orchestrator & COO)
**Purpose:** Intelligent task delegation across the multi-agent organization based on domain expertise
**Activation:** Automatically triggered when new tasks arrive from user or are identified internally
**Key Principle:** Right task → Right Chief → Right time

## Primary Routing Logic

### Content & Media Domain
**→ Buzz (Chief Creative Officer - YouTube)**
- YouTube content ideas, concepts, themes
- Video scripts, outlines, storyboards
- Channel strategy, audience growth plans
- Content calendars, publishing schedules
- Monetization strategies for YouTube
- DJ Detective content development
- Competitor analysis for YouTube space

**→ Lens (Media Producer)**
- Video production, editing, post-production
- Audio engineering, sound design, mixing
- Visual effects, graphics, animations
- Thumbnail creation, channel art
- Technical aspects of video publishing
- Equipment recommendations, setup
- Production workflow optimization

### Business & Technology Domain
**→ Elon (Chief Technical Officer)**
- Code development, programming tasks
- IT infrastructure projects
- Automation tools, scripts, bots
- Technical troubleshooting, debugging
- System architecture, design patterns
- API integrations, web services
- Dishwasher Management App development
- Technical documentation
- Software testing, quality assurance

**→ Goldie (Marketing Chief)**
- Shopify store setup, configuration
- Product listings, descriptions, pricing
- Marketing campaigns, promotions
- Advertising strategy (Google Ads, social media)
- Email marketing, newsletters
- Sales funnels, conversion optimization
- Customer segmentation, targeting
- Analytics, reporting, KPIs
- Competitor analysis for e-commerce

### Strategy & Opportunity Domain
**→ Warren (Strategy Chief)**
- Business opportunity identification
- Market research, industry analysis
- Competitive landscape assessment
- Business model development
- Investment thesis creation
- Strategic partnerships evaluation
- New market entry strategies
- Risk assessment, mitigation planning
- Long-term growth planning

### Personal & Life Domain
**→ June (Personal Life Manager)**
- Family logistics, scheduling, coordination
- Home maintenance tasks, repairs
- Personal errands, appointments
- Health, wellness, fitness planning
- Meal planning, grocery lists
- Travel arrangements, itineraries
- Work-life balance optimization
- Personal finance tracking (basic)
- Home organization, decluttering

### Memory & Coordination Domain
**→ Brains (Chief Memory Officer)**
- Memory updates, additions, corrections
- Memory pruning, cleanup, organization
- Knowledge structuring, categorization
- Cross-agent information synchronization
- Audit scheduling, execution
- Legacy archive management
- Memory hygiene enforcement
- Historical pattern analysis

## Multi-Department Task Handling

### When a task spans multiple departments:
1. **Task Analysis:** Lui breaks down the task into component parts
2. **Component Assignment:** Each part assigned to appropriate Chief
3. **Coordination Plan:** Define handoffs and dependencies
4. **Progress Tracking:** Monitor in PROJECT_BOARD.md
5. **Integration:** Ensure components come together cohesively

### Example: "Create a YouTube ad for our Shopify product"
- **Buzz:** Script writing, creative concept
- **Lens:** Video production, editing
- **Goldie:** Marketing message, call-to-action
- **Elon:** Landing page integration, tracking setup

### Coordination Protocol:
1. Lui creates master task in PROJECT_BOARD.md
2. Creates subtasks for each Chief involved
3. Sets clear dependencies and deadlines
4. Monitors progress across all components
5. Facilitates communication between Chiefs
6. Integrates final deliverables

## Ambiguity Resolution

### When task assignment is unclear:
1. **First:** Check against routing rules above
2. **Second:** Analyze task keywords and context
3. **Third:** Consider historical similar tasks
4. **Fourth:** Ask user for clarification

### Clarification Request Template:
```
## Task Routing Clarification Needed

**Original Task:** [Task description]

**Routing Options Considered:**
1. Option A: Assign to [Chief A] because [reason]
2. Option B: Assign to [Chief B] because [reason]
3. Option C: Split between [Chiefs] because [reason]

**Questions for You:**
- Which option would you prefer?
- Is there additional context I should consider?
- Should I proceed with my best guess? (I'd choose [option])

**Recommended Action:** [Lui's recommendation with rationale]
```

### Default Action if No Response:
If user doesn't respond within reasonable time:
1. Assign based on best judgment
2. Document assumption in PROJECT_BOARD.md
3. Flag for review during next executive sync
4. Be prepared to reassign if incorrect

## Priority-Based Routing

### Urgent Tasks (🚨):
- Route immediately to appropriate Chief
- Send priority notification
- Follow up within 1 hour
- Escalate if no response

### Important Tasks (⭐):
- Route within 4 hours
- Include in next executive sync agenda
- Monitor progress daily

### Routine Tasks (📋):
- Batch and route during daily planning
- Include in standard workflow
- Weekly progress check

### Backlog Tasks (⏳):
- Add to PROJECT_BOARD.md backlog
- Review during weekly planning
- Route when capacity available

## Capacity Monitoring

### Before Routing:
1. Check AGENT_STATUS.md for current focus/blockers
2. Consider current workload of each Chief
3. Balance distribution across organization
4. Avoid overloading any single Chief

### Load Balancing Rules:
- **Heavy Load:** >3 active projects → Route to lighter-loaded Chief in same domain
- **Blocked:** If Chief has blockers → Consider alternative routing or delay
- **Unresponsive:** If Chief not responding → Escalate or reassign

## Routing Documentation

### For Each Routed Task:
1. **Task ID:** Unique identifier
2. **Assigned To:** Chief name
3. **Assigned By:** Lui (with timestamp)
4. **Routing Rationale:** Why this Chief was chosen
5. **Expected Outcome:** What success looks like
6. **Deadline:** When task should be completed
7. **Dependencies:** Other tasks or Chiefs involved

### Update PROJECT_BOARD.md:
- Add task to appropriate project
- Set status to "Assigned" or "In Progress"
- Note assigned Chief and deadline
- Add routing notes if complex

## Exception Handling

### When a Chief Cannot Handle Task:
1. Chief reports inability to Lui
2. Lui reassesses routing decision
3. Considers:
   - Reassigning to different Chief
   - Breaking task into smaller parts
   - Seeking user guidance
   - Postponing until capacity available

### Routing Errors:
If task was incorrectly routed:
1. Acknowledge error promptly
2. Re-route to correct Chief
3. Update documentation with lesson learned
4. Adjust routing rules if pattern emerges

## Continuous Improvement

### Routing Rule Updates:
- Review routing effectiveness during executive syncs
- Gather feedback from Chiefs on task appropriateness
- Adjust rules based on performance data
- Document changes in routing_rules.md

### Performance Metrics:
- **Routing Accuracy:** % of tasks correctly assigned first time
- **Chief Satisfaction:** Feedback on task appropriateness
- **Completion Rate:** % of routed tasks completed successfully
- **Time to Assign:** Average time from task receipt to routing

---
**Skill Created:** 2026-04-09
**Last Updated:** 2026-04-09
**Maintained by:** Lui (Orchestrator & COO)

**Related Skills:** executive_sync.md, project_management.md (to be created)