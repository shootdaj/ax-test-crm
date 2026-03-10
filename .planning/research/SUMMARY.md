# Research Summary: CRM Application

## Stack Decision
- **Backend:** Node.js 20 + Express 4.x
- **Frontend:** Vanilla JavaScript SPA with hash routing
- **Storage:** In-memory JavaScript objects
- **Deployment:** Vercel serverless (api/index.js entry point)
- **Styling:** Custom CSS with CSS custom properties
- **Charts:** Hand-rolled SVG
- **Drag & Drop:** HTML5 native API

## Table Stakes
- Contact, Company, Deal CRUD
- Visual pipeline (kanban board)
- Activity tracking with timeline
- Dashboard with key metrics
- Search across entities
- Data tables with sort/filter/pagination

## Key Risks
1. **Vercel routing** -- Express must use full paths (/api/contacts), vercel.json routes all traffic to api/index.js
2. **SPA routing** -- Use hash-based routing to avoid conflicts with API routes
3. **Drag & drop** -- Requires careful preventDefault() handling in dragover
4. **Cold starts** -- In-memory data resets on Vercel cold starts (expected, seed data reloads)

## Architecture
6-phase build order:
1. Foundation (Express, Vercel config, health endpoint)
2. Data layer (store, seed data, CRUD APIs)
3. Business logic (pipeline, activities, analytics, search)
4. Frontend shell (SPA routing, sidebar, layout)
5. Frontend features (kanban, charts, tables, forms)
6. Polish (animations, transitions, responsive)

## Design Direction
- Professional light theme with blue accent (#2563EB)
- Salesforce/HubSpot aesthetic
- Data-dense, functional UI
- Responsive with sidebar navigation
