# Roadmap: ax-test-crm

**Created:** 2026-03-10
**Phases:** 5
**Requirements covered:** 43/43

## Phase Overview

| # | Phase | Goal | Requirements | Success Criteria |
|---|-------|------|--------------|------------------|
| 1 | Foundation & Infrastructure | Express app with Vercel deployment, health endpoint, project structure | INFR-01, INFR-02, INFR-03, INFR-04 | 4 |
| 2 | Data Layer & CRUD APIs | In-memory store, seed data, full CRUD for contacts/companies/deals | CONT-01..04, CONT-06, COMP-01..04, DEAL-01..06, DATA-01, DATA-02 | 5 |
| 3 | Business Logic & Analytics | Activities, pipeline analytics, dashboard data, search, import/export | ACTV-01..03, PIPE-01..04, DASH-01..04, SRCH-01..02, IMEX-01..02 | 5 |
| 4 | Frontend SPA & Detail Pages | SPA shell, sidebar, all pages, kanban board, charts, data tables, forms | UIUX-01..05, CONT-05, CONT-07, COMP-05, DEAL-07 | 5 |
| 5 | Polish & Responsive Design | Responsive sidebar, page transitions, final UI polish | UIUX-06, UIUX-07 | 3 |

---

## Phase 1: Foundation & Infrastructure

**Goal:** Set up the Express application with proper project structure, health endpoint, and working Vercel deployment.

**Requirements:** INFR-01, INFR-02, INFR-03, INFR-04

**Success Criteria:**
1. Express app starts locally and serves requests
2. GET /health returns 200 with JSON status
3. vercel.json and api/index.js are configured correctly
4. App deploys to Vercel and health endpoint works on deployed URL

---

## Phase 2: Data Layer & CRUD APIs

**Goal:** Implement the in-memory data store with seed data and full CRUD REST APIs for contacts, companies, and deals.

**Requirements:** CONT-01, CONT-02, CONT-03, CONT-04, CONT-06, COMP-01, COMP-02, COMP-03, COMP-04, DEAL-01, DEAL-02, DEAL-03, DEAL-04, DEAL-05, DEAL-06, DATA-01, DATA-02

**Success Criteria:**
1. In-memory store holds contacts, companies, deals with proper data structures
2. Seed data loads on startup with 15 contacts, 5 companies, 10 deals (realistic data)
3. All CRUD endpoints work: POST/GET/PUT/DELETE for contacts, companies, deals
4. Deal stage transitions create timestamped history entries
5. API responses include proper status codes, pagination support, and error handling

---

## Phase 3: Business Logic & Analytics

**Goal:** Add activity tracking, pipeline analytics, dashboard metrics, cross-entity search, and import/export functionality.

**Requirements:** ACTV-01, ACTV-02, ACTV-03, PIPE-01, PIPE-02, PIPE-03, PIPE-04, DASH-01, DASH-02, DASH-03, DASH-04, SRCH-01, SRCH-02, IMEX-01, IMEX-02

**Success Criteria:**
1. Activities API supports creating/listing activities linked to contacts and deals
2. Pipeline API returns stage summaries with deal counts and total values
3. Dashboard API returns aggregated metrics (pipeline value, deals closing this month, activity stats)
4. Search API returns results across contacts, companies, and deals
5. Import/export endpoints work for contacts JSON

---

## Phase 4: Frontend SPA & Detail Pages

**Goal:** Build the complete frontend SPA with professional UI: sidebar navigation, all pages (dashboard, contacts, companies, deals, pipeline kanban, activities), data tables, forms, charts, and detail pages with timelines.

**Requirements:** UIUX-01, UIUX-02, UIUX-03, UIUX-04, UIUX-05, CONT-05, CONT-07, COMP-05, DEAL-07

**Success Criteria:**
1. SPA shell with hash-based routing navigates between all pages
2. Sidebar navigation with icons and active state works correctly
3. Dashboard shows metric cards, pipeline funnel chart, and revenue bar chart
4. Pipeline kanban board displays deals by stage with drag-and-drop between columns
5. Contact/company detail pages show profile cards, activity timelines, and linked entities

---

## Phase 5: Polish & Responsive Design

**Goal:** Add responsive design (sidebar hamburger collapse on mobile), smooth page transitions, and final UI polish to achieve production-quality appearance.

**Requirements:** UIUX-06, UIUX-07

**Success Criteria:**
1. Sidebar collapses to hamburger menu on screens below 768px
2. Page transitions are smooth (fade/slide animations between views)
3. All pages look polished and professional on both desktop and mobile viewports

---

*Roadmap created: 2026-03-10*
