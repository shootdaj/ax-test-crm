# Pitfalls Research: CRM Application

## Critical Pitfalls

### 1. Vercel Routing Mismatch
**Warning signs:** 404 errors on deployed app, routes work locally but not on Vercel
**Prevention:** Express routes MUST use full paths (e.g., `/api/contacts`, not `/contacts`). Vercel does NOT strip path prefixes. Configure vercel.json to route everything to api/index.js. Test deployment early (Phase 1).
**Phase:** Phase 1 (Foundation)

### 2. SPA Client-Side Routing Conflicts with API Routes
**Warning signs:** Page refreshes return JSON instead of HTML, API calls return HTML
**Prevention:** Use hash-based routing (#/contacts, #/deals) for the SPA to avoid conflicts with Express API routes. Serve index.html for non-API, non-static requests.
**Phase:** Phase 4 (Frontend Shell)

### 3. Drag and Drop Browser Inconsistencies
**Warning signs:** Drag doesn't work in some browsers, drop zones don't highlight
**Prevention:** Always call e.preventDefault() in dragover handlers. Set dataTransfer.effectAllowed and dropEffect. Use dragenter/dragleave for visual feedback. Test in Chrome and Safari.
**Phase:** Phase 5 (Frontend Features)

### 4. In-Memory Data Loss on Vercel Cold Starts
**Warning signs:** Data resets between requests after idle period
**Prevention:** This is expected behavior. Seed data reloads on cold start. Document this limitation. Consider it a feature for demo purposes.
**Phase:** All phases

### 5. Large Seed Data Slowing Cold Starts
**Warning signs:** First request takes 2+ seconds
**Prevention:** Keep seed data generation fast -- use pre-built arrays, not complex loops. 15 contacts + 5 companies + 10 deals + 30 activities is small enough.
**Phase:** Phase 2 (Data Layer)

### 6. SVG Chart Sizing Issues
**Warning signs:** Charts overflow containers, don't resize on window change
**Prevention:** Use viewBox attribute for SVG elements, percentage-based widths. Use ResizeObserver for dynamic chart sizing.
**Phase:** Phase 5 (Dashboard Charts)

### 7. CSS Specificity Wars
**Warning signs:** Styles not applying, !important everywhere
**Prevention:** Use CSS custom properties for theming. Use BEM-like naming. Keep specificity low. Avoid nesting beyond 2 levels.
**Phase:** Phase 4 (Frontend Shell)

## Medium-Risk Pitfalls

### 8. Form Validation UX
**Prevention:** Validate on blur, not on input. Show errors inline next to fields. Don't block form submission for warnings.

### 9. Table Performance with Many Rows
**Prevention:** Paginate server-side (API accepts page/limit params). Don't render 1000+ rows in DOM.

### 10. Mobile Sidebar Toggle State
**Prevention:** Use CSS media queries + JS toggle. Remember to close sidebar on navigation on mobile.
