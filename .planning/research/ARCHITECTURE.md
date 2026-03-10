# Architecture Research: CRM Application

## Component Structure

### Backend (Express API)
```
src/
  app.js              -- Express app setup, middleware, route mounting
  routes/
    contacts.js       -- /api/contacts CRUD
    companies.js      -- /api/companies CRUD
    deals.js          -- /api/deals CRUD + stage transitions
    activities.js     -- /api/activities CRUD
    pipeline.js       -- /api/pipeline analytics
    dashboard.js      -- /api/dashboard aggregated metrics
    search.js         -- /api/search cross-entity search
    import-export.js  -- /api/import, /api/export
  data/
    store.js          -- In-memory data store (contacts, companies, deals, activities)
    seed.js           -- Seed data generator (15 contacts, 5 companies, 10 deals, 30 activities)
  middleware/
    error-handler.js  -- Centralized error handling
public/
  index.html          -- SPA shell
  css/
    styles.css        -- All styles (custom properties, layout, components)
  js/
    app.js            -- SPA router, page management
    api.js            -- API client (fetch wrapper)
    pages/
      dashboard.js    -- Dashboard page
      contacts.js     -- Contact list + detail
      companies.js    -- Company list + detail
      deals.js        -- Deal list
      pipeline.js     -- Kanban board
      activities.js   -- Activity log
    components/
      sidebar.js      -- Navigation sidebar
      table.js        -- Reusable data table with sort/search/pagination
      form.js         -- Form builder with validation
      charts.js       -- SVG chart components
      kanban.js       -- Kanban board with drag-and-drop
      timeline.js     -- Activity timeline component
      badges.js       -- Status badges
      breadcrumb.js   -- Breadcrumb navigation
api/
  index.js            -- Vercel entry point (exports Express app)
```

### Data Flow
1. User interacts with frontend SPA
2. Frontend makes fetch() calls to /api/* endpoints
3. Express routes handle requests, interact with in-memory store
4. Store returns data, Express sends JSON response
5. Frontend renders data into DOM

### Build Order (phase dependencies)
1. **Foundation:** Express app, project structure, Vercel config, health endpoint
2. **Data layer:** In-memory store, seed data, CRUD routes for contacts/companies/deals
3. **Business logic:** Pipeline stages, activities, analytics, search
4. **Frontend shell:** SPA routing, sidebar, page layout, basic pages
5. **Frontend features:** Kanban board, dashboard charts, data tables, forms
6. **Polish:** Animations, transitions, responsive design, final UI refinements
