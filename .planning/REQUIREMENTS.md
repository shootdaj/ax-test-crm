# Requirements: ax-test-crm

**Defined:** 2026-03-10
**Core Value:** Users can manage their sales pipeline visually -- tracking deals through stages from lead to close, with full contact and company context at every step.

## v1 Requirements

### Contacts

- [ ] **CONT-01**: User can create a contact with name, email, phone, company, title, tags, notes, and status
- [ ] **CONT-02**: User can view a list of all contacts with search and filtering
- [ ] **CONT-03**: User can update any contact's information
- [ ] **CONT-04**: User can delete a contact
- [ ] **CONT-05**: User can view a contact detail page with profile card, activity timeline, and linked deals
- [ ] **CONT-06**: Contact status is one of: lead, prospect, customer, churned -- displayed as colored badges
- [ ] **CONT-07**: User can view a contact's chronological timeline of all activities, deal changes, and notes

### Companies

- [ ] **COMP-01**: User can create a company with name, domain, industry, size, and revenue
- [ ] **COMP-02**: User can view a list of all companies with search
- [ ] **COMP-03**: User can update any company's information
- [ ] **COMP-04**: User can delete a company
- [ ] **COMP-05**: User can view a company detail page showing logo placeholder, linked contacts, and total deal value

### Deals

- [ ] **DEAL-01**: User can create a deal with title, value, stage, probability, expected close date, linked contact, linked company, and notes
- [ ] **DEAL-02**: User can view all deals in a list view with search
- [ ] **DEAL-03**: User can update any deal's information
- [ ] **DEAL-04**: User can delete a deal
- [ ] **DEAL-05**: User can move deals between pipeline stages (Lead, Qualified, Proposal, Negotiation, Closed Won, Closed Lost)
- [ ] **DEAL-06**: Deal stage transitions are logged with timestamps
- [ ] **DEAL-07**: Deal cards display formatted currency value, contact name, probability badge, and days in stage

### Pipeline

- [ ] **PIPE-01**: User can view deals as a horizontal kanban board with columns per pipeline stage
- [ ] **PIPE-02**: User can drag and drop deal cards between stage columns to change stage
- [ ] **PIPE-03**: Pipeline shows total deal value per stage in column headers
- [ ] **PIPE-04**: User can view pipeline analytics: conversion rates between stages, average deal cycle time, win rate

### Activities

- [ ] **ACTV-01**: User can log an activity (call, email, meeting, note) linked to a contact and/or deal
- [ ] **ACTV-02**: User can view a chronological activity log with icons per type and relative timestamps
- [ ] **ACTV-03**: Activities appear in contact and deal timelines automatically

### Dashboard

- [ ] **DASH-01**: User sees metric cards showing total pipeline value, deals closing this month, top contacts by deal value, and activity stats
- [ ] **DASH-02**: Metric cards display animated count-up numbers on page load
- [ ] **DASH-03**: User sees a pipeline funnel chart (SVG) showing deal counts and values per stage
- [ ] **DASH-04**: User sees a monthly revenue bar chart for closed deals

### Search

- [ ] **SRCH-01**: User can search across contacts, companies, and deals from a single search input
- [ ] **SRCH-02**: Search results are grouped by entity type with links to detail pages

### Import/Export

- [ ] **IMEX-01**: User can export all contacts as a JSON file download
- [ ] **IMEX-02**: User can import contacts from a JSON file

### UI/UX

- [ ] **UIUX-01**: Application has a professional light theme with blue accent (#2563EB)
- [ ] **UIUX-02**: Sidebar navigation with section icons and active state indicator
- [ ] **UIUX-03**: Breadcrumb navigation for drill-down pages
- [ ] **UIUX-04**: Data tables have sortable columns, search filter, and pagination
- [ ] **UIUX-05**: Forms have inline validation with floating labels on focus
- [ ] **UIUX-06**: Responsive design with sidebar collapsing to hamburger menu on mobile
- [ ] **UIUX-07**: Smooth page transitions between views

### Data

- [ ] **DATA-01**: Application loads with realistic seed data: 15 contacts, 5 companies, 10 deals, 30 activities
- [ ] **DATA-02**: Seed data uses real-sounding names, companies, deal values, and dates

### Infrastructure

- [ ] **INFR-01**: Express API serves both API endpoints and static frontend
- [ ] **INFR-02**: Health endpoint at /health returns 200
- [ ] **INFR-03**: Application deploys to Vercel via api/index.js entry point
- [ ] **INFR-04**: vercel.json routes all requests correctly

## v2 Requirements

### Advanced Pipeline
- **PIPE-05**: User can create custom pipeline stages
- **PIPE-06**: User can have multiple pipelines for different sales processes

### Reporting
- **REPT-01**: User can generate PDF reports of pipeline status
- **REPT-02**: User can set date range filters on dashboard

### Bulk Operations
- **BULK-01**: User can select multiple contacts and perform bulk actions (tag, delete, export)
- **BULK-02**: User can bulk-import from CSV

## Out of Scope

| Feature | Reason |
|---------|--------|
| User authentication | Single-user demo application |
| Persistent database | In-memory storage simplifies Vercel deployment |
| Email integration | Activity logging only, no SMTP |
| Real-time updates | Single-user, no WebSockets needed |
| File attachments | Text-based notes only |
| Mobile native app | Responsive web covers mobile use case |
| Multi-tenancy | Single-user demo |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| INFR-01 | Phase 1 | Pending |
| INFR-02 | Phase 1 | Pending |
| INFR-03 | Phase 1 | Pending |
| INFR-04 | Phase 1 | Pending |
| CONT-01 | Phase 2 | Pending |
| CONT-02 | Phase 2 | Pending |
| CONT-03 | Phase 2 | Pending |
| CONT-04 | Phase 2 | Pending |
| CONT-06 | Phase 2 | Pending |
| COMP-01 | Phase 2 | Pending |
| COMP-02 | Phase 2 | Pending |
| COMP-03 | Phase 2 | Pending |
| COMP-04 | Phase 2 | Pending |
| DEAL-01 | Phase 2 | Pending |
| DEAL-02 | Phase 2 | Pending |
| DEAL-03 | Phase 2 | Pending |
| DEAL-04 | Phase 2 | Pending |
| DEAL-05 | Phase 2 | Pending |
| DEAL-06 | Phase 2 | Pending |
| DATA-01 | Phase 2 | Pending |
| DATA-02 | Phase 2 | Pending |
| ACTV-01 | Phase 3 | Pending |
| ACTV-02 | Phase 3 | Pending |
| ACTV-03 | Phase 3 | Pending |
| PIPE-01 | Phase 3 | Pending |
| PIPE-02 | Phase 3 | Pending |
| PIPE-03 | Phase 3 | Pending |
| PIPE-04 | Phase 3 | Pending |
| DASH-01 | Phase 3 | Pending |
| DASH-02 | Phase 3 | Pending |
| DASH-03 | Phase 3 | Pending |
| DASH-04 | Phase 3 | Pending |
| SRCH-01 | Phase 3 | Pending |
| SRCH-02 | Phase 3 | Pending |
| IMEX-01 | Phase 3 | Pending |
| IMEX-02 | Phase 3 | Pending |
| UIUX-01 | Phase 4 | Pending |
| UIUX-02 | Phase 4 | Pending |
| UIUX-03 | Phase 4 | Pending |
| UIUX-04 | Phase 4 | Pending |
| UIUX-05 | Phase 4 | Pending |
| CONT-05 | Phase 4 | Pending |
| CONT-07 | Phase 4 | Pending |
| COMP-05 | Phase 4 | Pending |
| DEAL-07 | Phase 4 | Pending |
| UIUX-06 | Phase 5 | Pending |
| UIUX-07 | Phase 5 | Pending |

**Coverage:**
- v1 requirements: 43 total
- Mapped to phases: 43
- Unmapped: 0

---
*Requirements defined: 2026-03-10*
*Last updated: 2026-03-10 after initial definition*
