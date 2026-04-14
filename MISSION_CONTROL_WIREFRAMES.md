# MISSION CONTROL DASHBOARD - WIREFRAME SPECIFICATIONS
## Visual Design and Interaction Specifications
**Prepared by:** Warren (Strategy Chief)  
**Date:** 2026-04-10  
**Status:** Draft for Review

---

## 1. OVERVIEW

This document provides detailed wireframe specifications for the Mission Control Dashboard. Since actual image files cannot be created, this document uses detailed textual descriptions, layout specifications, and component definitions that can be used by designers and developers to create the visual interface.

---

## 2. DESIGN SYSTEM FOUNDATION

### 2.1 Color Palette

#### Primary Colors
- **Primary Blue:** `#2563EB` (Actions, primary buttons, active states)
- **Primary Dark:** `#1E40AF` (Hover states, accents)
- **Primary Light:** `#60A5FA` (Secondary actions, highlights)

#### Status Colors
- **Success/Online:** `#10B981` (Green)
- **Warning/Idle:** `#F59E0B` (Yellow/Amber)
- **Error/Offline:** `#EF4444` (Red)
- **Info/Neutral:** `#3B82F6` (Blue)
- **Disabled:** `#9CA3AF` (Gray)

#### Background Colors
- **Background Primary:** `#FFFFFF` (Light mode), `#111827` (Dark mode)
- **Background Secondary:** `#F9FAFB` (Light), `#1F2937` (Dark)
- **Background Tertiary:** `#F3F4F6` (Light), `#374151` (Dark)

#### Text Colors
- **Text Primary:** `#111827` (Light), `#F9FAFB` (Dark)
- **Text Secondary:** `#6B7280` (Light), `#D1D5DB` (Dark)
- **Text Tertiary:** `#9CA3AF` (Light), `#9CA3AF` (Dark)

### 2.2 Typography

#### Font Family
- **Primary Font:** Inter (Google Fonts) - `font-family: 'Inter', -apple-system, sans-serif`
- **Monospace Font:** JetBrains Mono - `font-family: 'JetBrains Mono', monospace`

#### Font Sizes (Scale)
- **H1:** `2.5rem` (40px) - Page titles
- **H2:** `2rem` (32px) - Section headers
- **H3:** `1.5rem` (24px) - Subsection headers
- **H4:** `1.25rem` (20px) - Card titles
- **Body Large:** `1.125rem` (18px) - Important text
- **Body:** `1rem` (16px) - Default text
- **Body Small:** `0.875rem` (14px) - Secondary text
- **Caption:** `0.75rem` (12px) - Labels, metadata

#### Font Weights
- **Light:** 300
- **Regular:** 400 (default)
- **Medium:** 500 (subheaders)
- **Semibold:** 600 (headers)
- **Bold:** 700 (important emphasis)

### 2.3 Spacing System (8px Grid)
- **XS:** `0.25rem` (4px)
- **S:** `0.5rem` (8px)
- **M:** `1rem` (16px)
- **L:** `1.5rem` (24px)
- **XL:** `2rem` (32px)
- **2XL:** `3rem` (48px)
- **3XL:** `4rem` (64px)

### 2.4 Border Radius
- **None:** `0` (tables, strict elements)
- **SM:** `0.25rem` (4px) - inputs, small elements
- **MD:** `0.5rem` (8px) - cards, buttons (default)
- **LG:** `1rem` (16px) - large containers, modals
- **Full:** `9999px` (pill buttons, avatars)

### 2.5 Shadows
- **XS:** `0 1px 2px 0 rgba(0, 0, 0, 0.05)` (subtle elevation)
- **SM:** `0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)`
- **MD:** `0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)` (cards)
- **LG:** `0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)` (modals)
- **XL:** `0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)` (large overlays)

---

## 3. COMPONENT LIBRARY SPECIFICATIONS

### 3.1 Navigation Components

#### Top Navigation Bar
```
┌─────────────────────────────────────────────────────────────────────────────┐
│ ┌──────┐ Mission Control               ┌─┐ ┌─┐ ┌─────┐ ┌─────────────────┐ │
│ │ 🦞   │                                │○│ │🔔│ │👤 ▼│ │ 🔍 Search...    │ │
│ └──────┘                                └─┘ └─┘ └─────┘ └─────────────────┘ │
├─────────────────────────────────────────────────────────────────────────────┤
│ [Dashboard] [Tasks] [Agents] [Analytics] [Alerts] [Memory] [Settings] [Help]│
└─────────────────────────────────────────────────────────────────────────────┘
```

**Specifications:**
- **Height:** 64px (top bar) + 48px (nav bar) = 112px total
- **Logo:** 32px × 32px lobster emoji + "Mission Control" text
- **Search Bar:** 240px width, rounded, with search icon
- **Notifications:** Bell icon with badge for unread count
- **User Menu:** Avatar/initials + dropdown arrow
- **Main Nav:** 8 items, evenly distributed, active item underlined

#### Side Navigation (Collapsible)
```
┌─────────────────┐
│   AGENTS        │ ← Section Title (H3)
├─────────────────┤
│ ○ All Agents    │ ← Active item (filled circle)
│ ○ Agent Details │
│ ○ Performance   │
│ ○ Activity Logs │
├─────────────────┤
│ Quick Actions   │ ← Subheader
├─────────────────┤
│ [Create Task]   │ ← Button
│ [View Reports]  │ ← Button
├─────────────────┤
│ Recent Views    │ ← Subheader
├─────────────────┤
│ • Lui Details   │ ← Recent item with bullet
│ • Task Board    │
└─────────────────┘
```

**Specifications:**
- **Width:** 240px (expanded), 64px (collapsed - icons only)
- **Section Spacing:** 24px between sections
- **Item Height:** 40px per navigation item
- **Active Indicator:** Filled circle + bold text
- **Quick Actions:** Button style, full width

### 3.2 Data Display Components

#### Status Card (Agent)
```
┌─────────────────────────────────────┐
│ LUI - COO/Orchestrator        ⚡    │ ← Name/Role + Status Icon
├─────────────────────────────────────┤
│ Status: ● ACTIVE                    │ ← Status indicator
│ Last Activity: 2 minutes ago        │ ← Timestamp
│ Tasks: 3 active, 12 completed today │ ← Metrics
├─────────────────────────────────────┤
│ Response Time: 45s (avg)            │ ← Performance
│ Completion Rate: 92%                │ ← Performance
├─────────────────────────────────────┤
│ [View Details] [Send Task]          │ ← Action Buttons
└─────────────────────────────────────┘
```

**Dimensions:** 280px × 200px
**Status Icons:** ⚡ (Active), ☀️ (Idle), ⚠️ (Error), ◯ (Offline)

#### KPI Widget
```
┌─────────────────────────────────────┐
│ Response Time                📈     │ ← Title + Icon
├─────────────────────────────────────┤
│ 45s                              │ ← Large value
│ ▲ 12% vs last week                │ ← Trend indicator
├─────────────────────────────────────┤
│ Target: < 60s                     │ ← Target
│ Current: 45s                      │ ← Current
│ Trend: Improving                  │ ← Trend label
└─────────────────────────────────────┘
```

**Dimensions:** 240px × 160px
**Value Display:** Large font (2rem), color-coded by performance
**Trend Indicator:** ▲ green for improvement, ▼ red for decline

#### Alert Card
```
┌─────────────────────────────────────┐
│ ⚠️ HIGH: Agent Offline              │ ← Severity + Title
├─────────────────────────────────────┤
│ Agent: Elon (CTO)                   │ ← Details
│ Duration: 15 minutes                │
│ Last Activity: Code review          │
├─────────────────────────────────────┤
│ [Acknowledge] [Investigate]         │ ← Actions
└─────────────────────────────────────┘
```

**Severity Colors:** 
- **Critical:** Red background, white text
- **High:** Orange background, dark text  
- **Medium:** Yellow background, dark text
- **Low:** Blue background, white text

### 3.3 Form Components

#### Input Field
```
┌─────────────────────────────────────┐
│ Task Title *                        │ ← Label (required *)
├─────────────────────────────────────┤
│ ┌─────────────────────────────────┐ │
│ │ Enter task title here           │ │ ← Placeholder
│ └─────────────────────────────────┘ │
├─────────────────────────────────────┤
│ Please enter a descriptive title    │ ← Help text
└─────────────────────────────────────┘
```

**States:**
- **Default:** Gray border
- **Focus:** Blue border, slight shadow
- **Error:** Red border, error message below
- **Disabled:** Gray background, lighter text

#### Dropdown Select
```
┌─────────────────────────────────────┐
│ Assign To *                         │
├─────────────────────────────────────┤
│ ┌─────────────────────────────────┐ │
│ │ Select an agent...          ▼   │ │ ← Placeholder + arrow
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘

Expanded:
┌─────────────────────────────────────┐
│ Select an agent...          ▲       │
├─────────────────────────────────────┤
│ ┌─────────────────────────────────┐ │
│ │ ○ Lui - COO                    │ │ ← Options with radio
│ │ ○ Warren - Strategy            │ │
│ │ ○ Elon - CTO                   │ │
│ │ ○ Brains - CMO                 │ │
│ │ ○ Lens - Media Producer        │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

#### Button Styles
```
Primary:   [ Create Task ]        ← Blue background, white text
Secondary: [ Cancel ]             ← White background, blue border/text
Tertiary:  Learn more →           ← Text only with arrow
Destructive: [ Delete ]           ← Red background, white text
Disabled:  [ Processing... ]      ← Gray background, lighter text
```

**Sizes:**
- **Large:** 48px height, 1.25rem text, 24px padding
- **Medium:** 40px height, 1rem text, 16px padding (default)
- **Small:** 32px height, 0.875rem text, 12px padding

---

## 4. SCREEN WIREFRAME SPECIFICATIONS

### 4.1 Screen 1: Dashboard Home

#### Layout Structure
```
Header (112px)
┌─────────────────────────────────────────────────────────────────┐
│ Page Title: Dashboard | Time: Today | [Refresh] [Customize]     │ ← 64px
├─────────────────────────────────────────────────────────────────┤
│ Section 1: Key Metrics (4 widgets in grid)                      │ ← 200px
│ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐│
│ │Response Time│ │Completion   │ │Availability │ │Error Rate   ││
│ │45s          │ │Rate 92%     │ │99.8%        │ │1.2%         ││
│ └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘│
├─────────────────────────────────────────────────────────────────┤
│ Section 2: Agent Status (8 cards in 2×4 grid)                   │ ← 440px
│ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐│
│ │Lui  │ │Warren│ │Elon │ │Brains│ │Lens │ │Buzz │ │Goldie│ │June││
│ │⚡   │ │⚡    │ │☀️   │ │⚡    │ │⚡    │ │⚡    │ │⚡    │ │⚡   ││
│ └─────┘ └─────┘ └─────┘ └─────┘ └─────┘ └─────┘ └─────┘ └─────┘│
├─────────────────────────────────────────────────────────────────┤
│ Section 3: Recent Activity & Alerts (side by side)              │ ← 300px
│ ┌──────────────────────┐ ┌──────────────────────┐              │
│ │ Recent Activity      │ │ Active Alerts (3)    │              │
│ │ • Lui assigned task  │ │ ⚠️ Elon offline      │              │
│ │ • Warren completed   │ │ ⚠️ High memory       │              │
│ │ • New alert created  │ │ ℹ️ Backup scheduled  │              │
│ └──────────────────────┘ └──────────────────────┘              │
├─────────────────────────────────────────────────────────────────┤
│ Section 4: Quick Actions (full width)                           │ ← 80px
│ ┌─────────────────────────────────────────────────────────────┐│
│ │ [Create Task] [View Reports] [Check Memory] [System Settings]││
│ └─────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
Footer (48px)
```

#### Responsive Behavior
- **Desktop (>1024px):** Full grid as shown
- **Tablet (768-1024px):** 2 widgets per row, 4 agents per row
- **Mobile (<768px):** 1 widget per row, 2 agents per row, stacked sections

### 4.2 Screen 2: Agent Detail (Lui as example)

#### Layout Structure
```
Header (112px)
┌─────────────────────────────────────────────────────────────────┐
│ Breadcrumbs: Dashboard > Agents > Lui | [Edit] [More Actions]▼  │
├─────────────────────────────────────────────────────────────────┤
│ Left Column: Agent Summary (fixed 320px)                        │
│ ┌─────────────────────────────────────────────────────────────┐│
│ │ Avatar: 🦞 (64px)                                          ││
│ │ Name: Lui                                                  ││
│ │ Role: COO/Orchestrator                                     ││
│ │ Status: ● ACTIVE (Online 4h 22m)                           ││
│ │                                                            ││
│ │ Key Metrics:                                               ││
│ │ • Response Time: 45s (▲ 12%)                               ││
│ │ • Task Completion: 94% (▲ 3%)                              ││
│ │ • Availability: 99.9%                                      ││
│ │                                                            ││
│ │ Quick Actions:                                             ││
│ │ [Send Task] [View Logs] [Performance]                      ││
│ └─────────────────────────────────────────────────────────────┘│
├─────────────────────────────────────────────────────────────────┤
│ Right Column: Tabs Content (fluid)                             │
│ Tabs: [Overview] [Activity] [Performance] [Tasks] [Settings]   │
│ ┌─────────────────────────────────────────────────────────────┐│
│ │ Overview Tab Content:                                       ││
│ │ • Current Tasks: 3 active                                   ││
│ │ • Recent Achievements: 12 tasks today                       ││
│ │ • Collaboration: Working with 4 agents                      ││
│ │ • System Access: Full permissions                           ││
│ │                                                            ││
│ │ Health Indicators:                                          ││
│ │ ┌────────┐ ┌────────┐ ┌────────┐                           ││
│ │ │Memory  │ │CPU     │ │Network │                           ││
│ │ │85%     │ │42%     │ │Good    │                           ││
│ │ └────────┘ └────────┘ └────────┘                           ││
│ └─────────────────────────────────────────────────────────────┘│
├─────────────────────────────────────────────────────────────────┤
│ Bottom Section: Recent Activity Timeline                       │
│ ┌─────────────────────────────────────────────────────────────┐│
│ │ 14:30: Assigned task "Fix monitoring"                       ││
│ │ 14:15: Completed "Update docs"                              ││
│ │ 13:45: Collaborated with Elon                               ││
│ └─────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘#### Tab Content Specifications

**Activity Tab:**
- Timeline view of all agent actions
- Filter by action type, time range
- Search within activity log
- Export activity data

**Performance Tab:**
- Charts: Response time trend, completion rate, error rate
- Comparisons: vs own history, vs other agents
- Performance breakdown by task type
- Improvement recommendations

**Tasks Tab:**
- Currently assigned tasks (with status)
- Recently completed tasks
- Task performance metrics
- Task history timeline

**Settings Tab:**
- Agent-specific configurations
- Notification preferences
- Access permissions
- Integration settings

### 4.3 Screen 3: Task Management

#### Layout Structure
```
Header (112px)
┌─────────────────────────────────────────────────────────────────┐
│ Page: Tasks | View: [List] [Board] [Calendar] | [New Task] [+]  │
├─────────────────────────────────────────────────────────────────┤
│ Filter Bar:                                                    │
│ ┌─────────────────────────────────────────────────────────────┐│
│ │Status: [All] ▼ Assignee: [All] ▼ Priority: [All] ▼ Search...││
│ └─────────────────────────────────────────────────────────────┘│
├─────────────────────────────────────────────────────────────────┤
│ Content Area: Task List View                                   │
│ ┌─────┬─────────────────┬─────────┬─────────┬─────────┬──────┐│
│ │ ✓   │ Task            │ Assignee│ Status  │ Due     │ Prio ││
│ ├─────┼─────────────────┼─────────┼─────────┼─────────┼──────┤│
│ │ □   │ Fix monitoring  │ Lui     │ In Prog │ Today   │ High ││
│ │ □   │ Update docs     │ Warren  │ Done    │ -       │ Med  ││
│ │ □   │ Review code     │ Elon    │ Blocked │ Tomorrow│ High ││
│ │ □   │ Create report   │ Brains  │ Todo    │ Fri     │ Low  ││
│ └─────┴─────────────────┴─────────┴─────────┴─────────┴──────┘│
│                                                               │
│ Selected: 1 task          [Assign] [Change Status] [Delete]   │
├─────────────────────────────────────────────────────────────────┤
│ Summary: 24 total, 4 in progress, 1 blocked, 18 done today    │
└─────────────────────────────────────────────────────────────────┘
Footer (48px)
```

#### Board View (Kanban)
```
┌──────────────┬──────────────┬──────────────┬──────────────┐
│ To Do (6)    │ In Progress(4)│ Review (2)   │ Done (12)    │
├──────────────┼──────────────┼──────────────┼──────────────┤
│ ┌──────────┐ │ ┌──────────┐ │ ┌──────────┐ │ ┌──────────┐ │
│ │Task 1    │ │ │Task 7    │ │ │Task 11   │ │ │Task 13   │ │
│ │High Prio │ │ │Lui       │ │ │Warren    │ │ │Completed │ │
│ └──────────┘ │ │In Prog   │ │ │Needs     │ │ │2h ago    │ │
│              │ └──────────┘ │ │Review    │ │ └──────────┘ │
│ ┌──────────┐ │ ┌──────────┐ │ ┌──────────┐ │ ┌──────────┐ │
│ │Task 2    │ │ │Task 8    │ │ │Task 12   │ │ │Task 14   │ │
│ │Medium    │ │ │Elon      │ │ │Brains    │ │ │Completed │ │
│ │          │ │ │Blocked   │ │ │Waiting   │ │ │1d ago    │ │
│ └──────────┘ │ └──────────┘ │ └──────────┘ │ └──────────┘ │
└──────────────┴──────────────┴──────────────┴──────────────┘
```

#### Calendar View
```
┌─────────────────────────────────────────────────────────────────┐
│ April 2026                [<] [Today] [>]                       │
├─────┬─────┬─────┬─────┬─────┬─────┬─────┬─────┬─────┬─────┬─────┤
│ Mon │ Tue │ Wed │ Thu │ Fri │ Sat │ Sun │                     │
├─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┤
│     │     │ 1   │ 2   │ 3   │ 4   │ 5   │                     │
├─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┤
│ 6   │ 7   │ 8   │ 9   │ 10  │ 11  │ 12  │                     │
│     │     │     │     │●Task│     │     │                     │
│     │     │     │     │Due  │     │     │                     │
├─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┤
│ 13  │ 14  │ 15  │ 16  │ 17  │ 18  │ 19  │                     │
├─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┤
│ 20  │ 21  │ 22  │ 23  │ 24  │ 25  │ 26  │                     │
├─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┤
│ 27  │ 28  │ 29  │ 30  │     │     │     │                     │
└─────┴─────┴─────┴─────┴─────┴─────┴─────┴─────┴─────┴─────┴─────┘
```

### 4.4 Screen 4: Analytics Dashboard

#### Layout Structure
```
Header (112px)
┌─────────────────────────────────────────────────────────────────┐
│ Analytics | Period: [Last 7 days] ▼ Compare: [Previous period] ▼│
├─────────────────────────────────────────────────────────────────┤
│ Main Chart Area (Large)                                         │
│ ┌─────────────────────────────────────────────────────────────┐│
│ │ Response Time Trend (Last 7 days)                           ││
│ │                                                             ││
│ │ 60s ┤                                    ●                  ││
│ │     │                         ●         ● ●                ││
│ │ 50s ┤                  ●     ● ●       ●   ●              ││
│ │     │           ●     ● ●   ●   ●     ●     ●            ││
│ │ 40s ┤    ●     ● ●   ●   ● ●     ●   ●       ●          ││
│ │     │  ● ●   ●   ● ●     ●         ● ●         ●        ││
│ │ 30s ┤●   ● ●     ●                     ●         ●      ││
│ │     │     ●                                           ●  ││
│ │ 20s ┤                                                   ●││
│ │     │                                                    ││
│ │     └──────┬──────┬──────┬──────┬──────┬──────┬──────┘  ││
│ │           Mon    Tue    Wed    Thu    Fri    Sat    Sun  ││
│ └─────────────────────────────────────────────────────────────┘│
├─────────────────────────────────────────────────────────────────┤
│ Secondary Charts (3 in row)                                     │
│ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐           │
│ │Completion    │ │Agent         │ │Task Type     │           │
│ │Rate          │ │Performance   │ │Distribution  │           │
│ │ 92%          │ │Lui: 45s      │ │Coding: 40%   │           │
│ │▲ 3%          │ │Warren: 52s   │ │Research: 30% │           │
│ └──────────────┘ └──────────────┘ └──────────────┘           │
├─────────────────────────────────────────────────────────────────┤
│ Data Table (Exportable)                                         │
│ ┌─────┬──────────────┬──────┬──────┬──────┬──────┐           │
│ │Agent│Avg Resp Time │Tasks │Done  │Rate  │Trend │           │
│ ├─────┼──────────────┼──────┼──────┼──────┼──────┤           │
│ │Lui  │45s           │24    │22    │92%   │▲     │           │
│ │Warren│52s          │18    │16    │89%   │▲     │           │
│ │Elon │38s           │20    │19    │95%   │▼     │           │
│ └─────┴──────────────┴──────┴──────┴──────┴──────┘           │
│                                                               │
│ [Export CSV] [Export PDF] [Schedule Report]                   │
└─────────────────────────────────────────────────────────────────┘
Footer (48px)
```

### 4.5 Screen 5: Alert Center

#### Layout Structure
```
Header (112px)
┌─────────────────────────────────────────────────────────────────┐
│ Alerts | Filter: [All] ▼ Severity: [All] ▼ Status: [Active] ▼   │
├─────────────────────────────────────────────────────────────────┤
│ Active Alerts Section                                           │
│ ┌─────────────────────────────────────────────────────────────┐│
│ │ ⚠️ CRITICAL: Gateway Connection Lost (2 minutes ago)        ││
│ │   OpenClaw gateway is not responding. Check service status. ││
│ │   [Acknowledge] [Investigate]                               ││
│ ├─────────────────────────────────────────────────────────────┤│
│ │ ⚠️ HIGH: Agent Offline - Elon (15 minutes ago)              ││
│ │   Elon (CTO) has been offline for 15 minutes. Last activity:││
│ │   Code review at 14:30.                                     ││
│ │   [Acknowledge] [Restart] [View Logs]                      ││
│ ├─────────────────────────────────────────────────────────────┤│
│ │ ℹ️ MEDIUM: High Memory Usage (1 hour ago)                   ││
│ │   Memory usage at 92%. Consider cleanup or increase limits. ││
│ │   [Acknowledge] [Cleanup] [Adjust Limits]                  ││
│ └─────────────────────────────────────────────────────────────┘│
├─────────────────────────────────────────────────────────────────┤
│ Alert History Section                                           │
│ ┌─────────────────────────────────────────────────────────────┐│
│ │ Today                                                       ││
│ │ • 14:45: Agent offline - Warren (Resolved)                  ││
│ │ • 13:20: Slow response - Lui (Acknowledged)                 ││
│ │ • 11:05: Task blocked - Project X (Resolved)                ││
│ │                                                             ││
│ │ Yesterday                                                   ││
│ │ • 16:30: Memory warning (Resolved)                          ││
│ │ • 09:15: Backup completed (Info)                            ││
│ └─────────────────────────────────────────────────────────────┘│
├─────────────────────────────────────────────────────────────────┤
│ Alert Statistics                                                │
│ ┌──────────────┬──────────────┬──────────────┬──────────────┐│
│ │ Active: 3    │ Today: 8     │ This Week: 42│ Resolved: 89%││
│ └──────────────┴──────────────┴──────────────┴──────────────┘│
└─────────────────────────────────────────────────────────────────┘
Footer (48px)
```

---

## 5. INTERACTION SPECIFICATIONS

### 5.1 Hover Interactions

#### Data Table Row Hover
```
Default: White background, gray text
Hover: Light blue background (#EFF6FF), cursor: pointer
Selected: Blue background (#2563EB), white text
```

#### Button Hover
```
Primary Button:
Default: Blue background (#2563EB), white text
Hover: Darker blue (#1D4ED8), slight shadow elevation
Active: Even darker blue (#1E40AF), shadow pressed

Secondary Button:
Default: White background, blue text (#2563EB), blue border
Hover: Light blue background (#EFF6FF)
Active: Medium blue background (#DBEAFE)
```

#### Card Hover
```
Default: White background, subtle shadow
Hover: Slightly elevated shadow, cursor: pointer
Active: Shadow pressed in, blue border left
```

### 5.2 Animation Specifications

#### Page Transitions
- **Route Changes:** Fade in/out, 300ms duration
- **Section Changes:** Slide left/right, 250ms duration
- **Modal Open/Close:** Fade + scale, 200ms duration

#### Data Updates
- **Real-time Updates:** Smooth fade to new value
- **New Items:** Slide in from right, 200ms
- **Removed Items:** Fade out, 150ms
- **Status Changes:** Color transition, 300ms

#### Loading States
- **Skeleton Screens:** Pulse animation, 1.5s cycle
- **Spinners:** Rotate continuously, 1s per rotation
- **Progress Bars:** Smooth width transition

### 5.3 Gesture Support (Mobile/Touch)

#### Swipe Gestures
- **Task List:** Swipe left for actions (complete, delete)
- **Dashboard:** Swipe horizontally between widget pages
- **Agent Details:** Swipe between tabs

#### Pull to Refresh
- **Lists:** Pull down to refresh content
- **Dashboard:** Pull down to refresh all data
- **Threshold:** 80px pull triggers refresh

#### Pinch to Zoom
- **Charts:** Pinch to zoom in/out on data
- **Images:** Standard pinch zoom
- **Maps:** If implemented later

#### Long Press
- **Items:** Long press for context menu
- **Buttons:** Long press for alternative action
- **Duration:** 500ms threshold

---

## 6. RESPONSIVE DESIGN SPECIFICATIONS

### 6.1 Breakpoint Specifications

#### Mobile (< 768px)
- **Navigation:** Hamburger menu, bottom tab bar
- **Layout:** Single column, vertical scroll
- **Tables:** Card-based instead of table rows
- **Charts:** Simplified, touch-optimized
- **Actions:** Larger touch targets (44px minimum)

#### Tablet (768px - 1024px)
- **Navigation:** Collapsible sidebar, top bar
- **Layout:** Two columns max, flexible grid
- **Tables:** Scrollable horizontally if needed
- **Charts:** Medium complexity, touch-friendly
- **Actions:** Standard size, touch-optimized

#### Desktop (> 1024px)
- **Navigation:** Full sidebar, top bar
- **Layout:** Multi-column, complex grids
- **Tables:** Full featured with all columns
- **Charts:** Full complexity, hover interactions
- **Actions:** Standard web interactions

#### Large Desktop (> 1440px)
- **Navigation:** Expanded sidebar, additional features
- **Layout:** Extra columns, more widgets visible
- **Tables:** More columns visible without scrolling
- **Charts:** Higher density, more data points
- **Actions:** Keyboard shortcut emphasis

### 6.2 Mobile-Specific Patterns

#### Bottom Navigation Bar
```
┌─────────────────────────────────────────────────┐
│ Content Area (fills most of screen)             │
│                                                 │
│                                                 │
│                                                 │
│                                                 │
│                                                 │
│                                                 │
│                                                 │
│                                                 │
├─────────────────────────────────────────────────┤
│ [🏠] [📋] [👥] [📈] [⚙️]                         │ ← Fixed bottom bar
└─────────────────────────────────────────────────┘
```

#### Mobile Card List (instead of table)
```
┌─────────────────────────────────────────────────┐
│ Task: Fix monitoring bug                        │
│ Assignee: Lui • Status: In Progress             │
│ Due: Today • Priority: High                     │
│ [Complete] [View]                               │
├─────────────────────────────────────────────────┤
│ Task: Update documentation                      │
│ Assignee: Warren • Status: Done                 │
│ Due: - • Priority: Medium                       │
│ [Reopen] [View]                                 │
└─────────────────────────────────────────────────┘
```

#### Mobile Form Layout
```
┌─────────────────────────────────────────────────┐
│ Create New Task                                 │
├─────────────────────────────────────────────────┤
│ Title *                                         │
│ ┌─────────────────────────────────────────────┐ │
│ │                                             │ │
│ └─────────────────────────────────────────────┘ │
│                                                 │
│ Description                                     │
│ ┌─────────────────────────────────────────────┐ │
│ │                                             │ │
│ └─────────────────────────────────────────────┘ │
│                                                 │
│ Assign To *                                     │
│ ┌─────────────────────────────────────────────┐ │
│ │ Select agent...                         ▼   │ │
│ └─────────────────────────────────────────────┘ │
│                                                 │
│ [Cancel]                     [Create Task]      │
└─────────────────────────────────────────────────┘
```

### 6.3 Responsive Chart Behavior

#### Desktop Charts
- **Complexity:** Multiple data series, interactive tooltips
- **Interactions:** Hover for details, click to drill down
- **Size:** Large