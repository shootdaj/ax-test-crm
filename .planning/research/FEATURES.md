# Features Research: CRM Application

## Table Stakes (must have or users leave)

### Contact Management
- CRUD operations for contacts with standard fields (name, email, phone, company, title)
- Contact status tracking (lead, prospect, customer, churned)
- Search and filtering
- Contact detail view with activity history
- **Complexity:** Medium

### Company Management
- CRUD operations for companies
- Link contacts to companies
- Company overview with aggregate data
- **Complexity:** Medium

### Deal/Opportunity Pipeline
- Visual pipeline (kanban board) showing deals by stage
- Deal creation with value, probability, expected close date
- Stage transitions with history
- Pipeline stages: Lead > Qualified > Proposal > Negotiation > Closed Won > Closed Lost
- **Complexity:** High (kanban drag-and-drop is the most complex UI component)

### Activity Tracking
- Log different activity types: calls, emails, meetings, notes
- Link activities to contacts and deals
- Chronological timeline view
- **Complexity:** Medium

### Dashboard/Analytics
- Pipeline value summary
- Deal forecasting (by expected close date)
- Activity statistics
- Key metrics at a glance
- **Complexity:** Medium-High (SVG charts)

## Differentiators (competitive advantage)

### Data Visualization
- Animated count-up numbers on dashboard
- Pipeline funnel chart showing conversion
- Revenue bar chart
- **Complexity:** Medium

### Professional UI Polish
- Floating label forms
- Smooth page transitions
- Breadcrumb navigation
- Status badges with semantic colors
- Responsive sidebar with hamburger collapse
- **Complexity:** Medium

### Import/Export
- JSON import/export for contacts
- **Complexity:** Low

## Anti-Features (deliberately NOT building)
- User authentication -- single-user demo
- Real database -- in-memory only
- Email integration -- log-only
- Real-time features -- single-user
- File uploads -- text only

## Dependencies Between Features
1. Contact/Company management must exist before Deals (deals reference contacts/companies)
2. Activities require contacts/deals to link to
3. Dashboard/Analytics depends on deals and activities existing
4. Pipeline board depends on deals and stage management
5. Import/Export depends on contact management
