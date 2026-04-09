# Skill: Memory Routing Rules

**Owner:** Brains (Chief Memory Officer)
**Purpose:** Manage memory flow across the multi-agent organization, ensuring right information goes to right locations
**Activation:** Continuous monitoring of all agent memory outputs
**Key Principle:** Central memory for business insights, distributed memory for operational details

## Memory Destination Rules

### Central Memory (central_memory.md)
**Purpose:** Long-term business knowledge, cross-department insights, key decisions
**Line Limit:** <500 lines (enforced by CMO)
**Update Frequency:** As needed, but pruned weekly

#### What Goes to Central Memory:
**→ From Buzz (YouTube Creative):**
- Creative insights with strategic implications
- YouTube channel growth patterns
- Audience behavior trends
- Monetization strategy decisions
- Competitive analysis findings
- Content-performance correlations

**→ From Elon (CTO):**
- Technical architecture decisions
- System design patterns adopted
- Technology stack evaluations
- Security/risk assessments
- Scalability considerations
- Integration strategy decisions

**→ From Goldie (Marketing):**
- Marketing campaign performance insights
- Customer segmentation discoveries
- Conversion optimization learnings
- Market positioning decisions
- Brand strategy adjustments
- Competitive marketing analysis

**→ From Warren (Strategy):**
- Opportunity summaries with evaluation
- Market research conclusions
- Business model insights
- Strategic partnership assessments
- Risk/reward analyses
- Long-term trend identifications

**→ From Lui (COO):**
- High-level organizational decisions
- Executive sync summaries
- Priority-setting rationales
- Resource allocation decisions
- Cross-department coordination insights
- Performance metric evaluations

### Distributed Memory (Agent-Specific Folders)
**Purpose:** Operational details, work logs, personal information, technical specifics
**Location:** `/home/user/.openclaw/workspace/agents/[Chief]/memory/`
**Update Frequency:** Daily or as needed

#### What Stays in Distributed Memory:
**→ Lens (Media Producer):**
- Production logs, edit timelines
- Equipment settings, configurations
- Technical troubleshooting notes
- File organization structures
- Workflow optimization attempts
- Software tool usage notes

**→ June (Personal Life Manager):**
- Family logistics details
- Personal appointment schedules
- Home maintenance task lists
- Health/fitness tracking
- Meal planning details
- Personal finance records
- Relationship management notes

**→ Elon (CTO) - Technical Logs:**
- Code implementation details
- Debugging session notes
- API endpoint specifications
- System configuration files
- Testing procedures and results
- Deployment checklists

**→ All Chiefs - Operational Logs:**
- Daily task completion records
- Meeting notes (unless strategic)
- Communication transcripts
- Work-in-progress details
- Temporary reference materials

## Memory Processing Workflow

### Step 1: Memory Capture
1. **Automatic:** Agents write to their distributed memory folders
2. **Manual:** Chiefs flag items for central memory consideration
3. **CMO Review:** Brains monitors all memory outputs

### Step 2: Memory Evaluation
**Criteria for Central Memory Inclusion:**
1. **Strategic Value:** Impacts organizational direction
2. **Cross-Department Relevance:** Useful to multiple Chiefs
3. **Long-Term Importance:** Will be referenced >30 days
4. **Decision Documentation:** Explains why choices were made
5. **Pattern Identification:** Reveals trends or correlations

**Criteria for Distributed Memory:**
1. **Operational Detail:** Specific to task execution
2. **Temporary Relevance:** Needed <30 days
3. **Single-Department Use:** Only relevant to one Chief
4. **Personal/Private:** Family or personal information
5. **Technical Specificity:** Implementation details only

### Step 3: Memory Routing
**For Central Memory Candidates:**
1. Extract distilled insight from detailed logs
2. Format for central_memory.md structure
3. Add to appropriate section (YouTube, IT, Marketing, etc.)
4. Update cross-reference pointers if needed
5. Verify line count compliance (<500 lines)

**For Distributed Memory:**
1. Ensure proper folder organization
2. Apply consistent naming conventions
3. Add metadata (date, context, related projects)
4. Set retention policies (30/90/180 days)
5. Create search indexes if volume grows

### Step 4: Memory Pruning (Weekly)
**Central Memory Pruning:**
1. Remove outdated information (>90 days unless critical)
2. Consolidate similar entries
3. Archive to legacy_archive.md if historically significant
4. Verify line count <500
5. Update archive pointers

**Distributed Memory Pruning:**
1. Review each Chief's memory folder
2. Remove temporary files (>30 days old)
3. Archive completed project logs
4. Compress large log files
5. Update retention schedules

## Memory Quality Standards

### Central Memory Entries Must:
1. **Be Concise:** 1-3 sentences per insight
2. **Include Context:** What led to this insight
3. **Show Impact:** How this affects the organization
4. **Be Actionable:** What should be done with this knowledge
5. **Be Timestamped:** When the insight was gained
6. **Be Attributed:** Which Chief provided it

### Distributed Memory Should:
1. **Be Organized:** Logical folder structure
2. **Be Searchable:** Clear filenames, keywords
3. **Be Complete:** Enough detail to recreate work
4. **Be Dated:** All entries timestamped
5. **Be Relevant:** Only keep what's needed

## Exception Handling

### When Memory Doesn't Fit Rules:
1. **CMO Judgment:** Brains makes final determination
2. **Temporary Holding:** Place in "review" folder for later decision
3. **User Consultation:** Ask user for guidance on borderline cases
4. **Rule Adjustment:** Update memory_routing.md if pattern emerges

### Borderline Cases Examples:
- **Personal business idea:** → Central memory (business relevance)
- **Technical decision with personal impact:** → Both locations (with cross-reference)
- **Family logistics with business timing:** → June's memory with central reference

## Memory Security & Privacy

### Privacy Rules:
1. **Personal Information:** Always in June's memory folder
2. **Financial Details:** Encrypted or in secure location
3. **Family Matters:** Never in central memory without explicit permission
4. **Health Information:** Protected in personal memory only

### Access Control:
1. **Central Memory:** Readable by all Chiefs
2. **Distributed Memory:** Primary access by owning Chief
3. **CMO Access:** Brains can read all memory for pruning/routing
4. **User Access:** You have access to all memory locations

## Memory Routing Examples

### Example 1: YouTube Content Insight
**From Buzz:** "Video about dishwasher repair got 3x average views"
**CMO Processing:** 
- **Central Memory:** "Dishwasher-related content performs well (3x views). Consider more home appliance content."
- **Distributed Memory:** Full analytics report in Buzz/memory/analytics/

### Example 2: Technical Decision
**From Elon:** "Chose React over Vue for dishwasher app frontend"
**CMO Processing:**
- **Central Memory:** "Dishwasher app uses React (decision: better component ecosystem)"
- **Distributed Memory:** Full evaluation matrix in Elon/memory/tech-decisions/

### Example 3: Personal Schedule
**From June:** "Family vacation scheduled for July 15-22"
**CMO Processing:**
- **Distributed Memory:** Full vacation details in June/memory/calendar/
- **Central Memory:** Nothing (unless business impact identified)

## Performance Metrics

### Memory Routing Accuracy:
- **Correct Placement:** % of memories routed to appropriate location
- **Pruning Effectiveness:** % reduction in memory volume while preserving value
- **Search Success:** Ease of finding information when needed
- **Chief Satisfaction:** Feedback on memory usefulness

### Weekly Audit Checklist:
1. Central memory line count <500 ✓
2. All memory folders organized ✓
3. Old files archived or deleted ✓
4. Cross-references updated ✓
5. Privacy rules followed ✓
6. Quality standards met ✓

## Continuous Improvement

### Rule Refinement:
- Review routing decisions during weekly audits
- Gather feedback from Chiefs on memory usefulness
- Adjust rules based on organizational needs
- Document changes in memory_routing.md

### Technology Integration:
- Consider automation tools for memory routing
- Implement search/indexing if volume grows
- Explore backup/version control for critical memory
- Monitor storage usage and optimize

---
**Skill Created:** 2026-04-09
**Last Updated:** 2026-04-09
**Maintained by:** Brains (Chief Memory Officer)

**Related Files:**
- central_memory.md (destination)
- legacy_archive.md (archive)
- memory/YYYY-MM-DD.md (daily logs)
- agents/[Chief]/memory/ (distributed storage)

**Next Audit:** 2026-04-16 (Monday, 09:00 EDT)