#!/bin/bash

# Tooling Survey Initiation Script
# Purpose: Start the agent tooling needs assessment process
# Author: Elon (CTO)
# Date: 2026-04-09

echo "========================================="
echo "AGENT TOOLING SURVEY INITIATION"
echo "========================================="
echo "Date: $(date)"
echo "CTO: Elon"
echo "Purpose: Identify technical tooling needs across organization"
echo ""

# Survey overview
echo "SURVEY OVERVIEW:"
echo "----------------"
echo "As CTO, I'm building tools to enhance agent productivity and automation."
echo "This survey will help me understand what tools each Chief needs most."
echo ""

# Survey process
echo "SURVEY PROCESS:"
echo "---------------"
echo "1. Brief interview with each Chief (15 minutes)"
echo "2. Focus on: Current workflows, data needs, automation opportunities"
echo "3. Documentation of specific tool requirements"
echo "4. Prioritization based on impact/effort analysis"
echo ""

# Expected outcomes
echo "EXPECTED OUTCOMES:"
echo "------------------"
echo "1. Clear understanding of agent tooling needs"
echo "2. Prioritized list of tools to develop"
echo "3. First tool (analytics fetcher) deployed by 2026-04-12"
echo "4. Comprehensive tooling roadmap for next 30 days"
echo ""

# Survey questions summary
echo "KEY SURVEY QUESTIONS:"
echo "---------------------"
echo "1. What repetitive tasks do you perform daily/weekly?"
echo "2. What data do you need to make decisions?"
echo "3. What tasks could be automated with the right tool?"
echo "4. What systems need to talk to each other?"
echo "5. What would success look like for automation?"
echo ""

# Next steps
echo "NEXT STEPS:"
echo "-----------"
echo "1. Elon will schedule 15-minute interviews with each Chief"
echo "2. Interviews to be completed by end of day 2026-04-10"
echo "3. Tool prioritization and development plan by 2026-04-11"
echo "4. First tool development starts 2026-04-11"
echo ""

# Contact information
echo "CONTACT:"
echo "--------"
echo "Elon (CTO) - Available for technical consultation"
echo "Survey Documentation: /home/user/.openclaw/workspace/agents/Elon/TOOLING_SURVEY.md"
echo "Tool Development Roadmap: To be created after survey completion"
echo ""

echo "========================================="
echo "SURVEY INITIATION COMPLETE"
echo "========================================="

# Create interview scheduling template
cat > /tmp/tooling_interview_template.md << 'EOF'
# Tooling Needs Interview - [Agent Name]

## Interview Details
- **Date:** [Date]
- **Time:** [Time]
- **Duration:** 15 minutes
- **Interviewer:** Elon (CTO)
- **Interviewee:** [Agent Name/Role]

## Questions & Notes

### 1. Current Workflows
- What repetitive tasks do you perform daily/weekly?
- What manual data collection or processing do you do?
- What external systems do you interact with regularly?
- What takes the most time in your current processes?

### 2. Data Needs
- What data do you need to make decisions?
- Where does this data currently come from?
- How do you currently access/process this data?
- What format would be most useful (API, CSV, dashboard, etc.)?

### 3. Automation Opportunities
- What tasks could be automated with the right tool?
- What triggers these tasks (time, event, condition)?
- What would success look like for automation?
- What risks or edge cases need consideration?

### 4. Tool Specifications
- **Input:** What data/parameters would the tool need?
- **Processing:** What transformations or calculations are needed?
- **Output:** What format/results should the tool produce?
- **Frequency:** How often would the tool run?

### 5. Priority & Impact
- Which tool would have the biggest impact on your work?
- How much time would it save daily/weekly?
- What's the consequence of not having this tool?

## Action Items
- [ ] Document specific tool requirements
- [ ] Estimate development complexity (Low/Medium/High)
- [ ] Identify dependencies or integration needs
- [ ] Schedule follow-up for prototype review

## Notes
[Space for interview notes]

---
**Interview Completed:** [Yes/No]
**Follow-up Required:** [Yes/No]
**Next Steps:** [Specific actions]
EOF

echo "Interview template created at: /tmp/tooling_interview_template.md"
echo ""
echo "To schedule interviews, Elon will contact each Chief directly."
echo "Survey results will be compiled in: /home/user/.openclaw/workspace/agents/Elon/TOOLING_SURVEY_RESULTS.md"