# ax-test-crm

## What This Is

A polished CRM (Customer Relationship Manager) web application -- a mini HubSpot/Pipedrive. It provides contact, company, and deal management with a visual pipeline board, activity tracking, and analytics dashboard. Built as a Node.js/Express single-page application with in-memory storage, deployed to Vercel.

## Core Value

Users can manage their sales pipeline visually -- tracking deals through stages from lead to close, with full contact and company context at every step.

## Requirements

### Validated

(None yet -- ship to validate)

### Active

- [ ] Contacts CRUD with fields: name, email, phone, company, title, tags, notes, last_contacted, status (lead/prospect/customer/churned)
- [ ] Companies CRUD with fields: name, domain, industry, size, revenue, contacts list
- [ ] Deals CRUD with fields: title, value, stage, probability, expected_close_date, contact_id, company_id, notes
- [ ] Configurable pipeline stages: Lead, Qualified, Proposal, Negotiation, Closed Won, Closed Lost
- [ ] Deal stage transitions with timestamp logging
- [ ] Activities: log calls, emails, meetings, notes with timestamps and contact/deal linkage
- [ ] Pipeline analytics: total deal value per stage, conversion rates, average deal cycle time, win rate
- [ ] Contact timeline: all activities, deal changes, notes in chronological order
- [ ] Dashboard: pipeline value, deals closing this month, top contacts, activity stats
- [ ] Import/export contacts as JSON
- [ ] Search across contacts, companies, deals
- [ ] In-memory storage with seed data (15 contacts, 5 companies, 10 deals, 30 activities)
- [ ] Professional light theme with blue accent (#2563EB)
- [ ] Pipeline board: horizontal kanban with deal cards draggable between stage columns
- [ ] Deal cards: formatted currency value, contact name, probability badge, days in stage
- [ ] Contact detail page: profile card, vertical activity timeline, linked deals
- [ ] Company page: logo placeholder, contact list, total deal value
- [ ] Dashboard: animated count-up metric cards, pipeline funnel chart (SVG), monthly revenue bar chart
- [ ] Data tables with sortable columns, search filter, pagination
- [ ] Activity log with icons per type (phone, email, calendar, note) and relative timestamps
- [ ] Forms with inline validation, floating labels on focus
- [ ] Sidebar navigation with section icons and active state indicator
- [ ] Breadcrumb navigation for drill-down pages
- [ ] Status badges (colored pills: green=customer, yellow=prospect, etc.)
- [ ] Responsive design: sidebar collapses to hamburger menu on mobile
- [ ] Smooth page transitions

### Out of Scope

- Authentication/user accounts -- single-user demo app
- Persistent database -- in-memory storage only
- Email sending -- activity logging only, no actual email integration
- Real-time collaboration -- single-user
- File attachments -- text-based notes only
- Mobile native app -- responsive web only

## Context

- This is a demonstration/test CRM application showcasing a full-featured sales pipeline management tool
- Node.js + Express backend serving both API and frontend
- Single-page application architecture with client-side routing
- All data stored in memory with realistic seed data for demo purposes
- Deployed as a Vercel serverless function via api/index.js entry point
- Frontend should look like a real SaaS product -- professional, data-dense, functional

## Constraints

- **Stack**: Node.js with Express -- no frontend frameworks (vanilla JS SPA)
- **Storage**: In-memory only -- no database required
- **Deployment**: Vercel serverless -- api/index.js entry point with vercel.json routing
- **Design**: Professional light theme with #2563EB blue accent, Salesforce/HubSpot aesthetic
- **Data**: Must include realistic seed data: 15 contacts, 5 companies, 10 deals, 30 activities

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| In-memory storage over database | Simplifies deployment to Vercel, no external dependencies | -- Pending |
| Vanilla JS SPA over React/Vue | No build step, simpler Vercel deployment, faster iteration | -- Pending |
| Express for API + static serving | Single server handles everything, clean API structure | -- Pending |
| Kanban board for pipeline | Industry standard for deal pipeline visualization | -- Pending |

---
*Last updated: 2026-03-10 after initialization*
