# Stack Research: CRM Web Application

## Recommended Stack

### Backend
- **Runtime:** Node.js 20 LTS
- **Framework:** Express 4.x -- mature, well-documented, Vercel-compatible
- **API Style:** RESTful JSON APIs
- **Storage:** In-memory JavaScript objects (Maps/Arrays) -- no database needed
- **Validation:** Manual validation in route handlers (no external library needed for this scope)

### Frontend
- **Approach:** Vanilla JavaScript SPA -- no framework, no build step
- **Routing:** Hash-based client-side routing (#/contacts, #/deals, etc.)
- **Styling:** CSS custom properties for theming, CSS Grid and Flexbox for layout
- **Charts:** Hand-rolled SVG for pipeline funnel and bar charts (no chart library needed)
- **Icons:** Inline SVG icons or Unicode symbols for simplicity
- **Drag & Drop:** HTML5 Drag and Drop API for kanban board

### Deployment
- **Platform:** Vercel serverless functions
- **Entry point:** api/index.js exports Express app
- **Static assets:** Served by Express from public/ directory
- **Config:** vercel.json routes all requests to api/index.js

## What NOT to Use
- **React/Vue/Angular** -- overkill for this scope, adds build complexity
- **Database (SQLite, PostgreSQL)** -- in-memory is sufficient, simplifies Vercel deployment
- **Chart.js/D3** -- SVG charts are simple enough to hand-roll for funnel and bar charts
- **Tailwind/Bootstrap** -- custom CSS keeps it lean and gives full control over the professional aesthetic
- **TypeScript** -- adds build step, vanilla JS is fine for this scope

## Confidence Levels
- Express + Vercel: HIGH -- well-proven combination
- Vanilla JS SPA: HIGH -- no build step, full control
- In-memory storage: HIGH -- perfect for demo/test CRM
- HTML5 Drag and Drop: MEDIUM -- works well but needs careful event handling
- SVG charts: HIGH -- simple shapes, no library needed
