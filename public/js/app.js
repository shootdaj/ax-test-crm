// CRM Single Page Application
document.addEventListener('DOMContentLoaded', () => {
  const app = document.getElementById('app');

  // Build app layout
  app.innerHTML = `
    <div class="hamburger" id="hamburger">
      <div class="hamburger-line"></div>
      <div class="hamburger-line"></div>
      <div class="hamburger-line"></div>
    </div>
    <div class="sidebar-overlay" id="sidebarOverlay"></div>
    <div class="app-layout">
      <aside class="sidebar" id="sidebar">
        <div class="sidebar-header">
          <div class="sidebar-logo">
            <div class="sidebar-logo-icon">CRM</div>
            <span>SalesPipe</span>
          </div>
        </div>
        <nav class="sidebar-nav">
          <div class="nav-section">
            <div class="nav-item" data-page="dashboard">
              <span class="nav-icon">\u{1F4CA}</span>
              <span>Dashboard</span>
            </div>
          </div>
          <div class="nav-section">
            <div class="nav-section-title">Sales</div>
            <div class="nav-item" data-page="pipeline">
              <span class="nav-icon">\u{1F3AF}</span>
              <span>Pipeline</span>
            </div>
            <div class="nav-item" data-page="deals">
              <span class="nav-icon">\u{1F4B0}</span>
              <span>Deals</span>
            </div>
          </div>
          <div class="nav-section">
            <div class="nav-section-title">Contacts</div>
            <div class="nav-item" data-page="contacts">
              <span class="nav-icon">\u{1F465}</span>
              <span>Contacts</span>
            </div>
            <div class="nav-item" data-page="companies">
              <span class="nav-icon">\u{1F3E2}</span>
              <span>Companies</span>
            </div>
          </div>
          <div class="nav-section">
            <div class="nav-section-title">Activity</div>
            <div class="nav-item" data-page="activities">
              <span class="nav-icon">\u{1F4CB}</span>
              <span>Activities</span>
            </div>
          </div>
        </nav>
      </aside>
      <main class="main-content" id="mainContent">
        <div class="loading">Loading...</div>
      </main>
    </div>
  `;

  // Navigation
  const navItems = document.querySelectorAll('.nav-item[data-page]');
  const mainContent = document.getElementById('mainContent');
  const sidebar = document.getElementById('sidebar');
  const hamburger = document.getElementById('hamburger');
  const overlay = document.getElementById('sidebarOverlay');

  // Mobile sidebar toggle
  hamburger.addEventListener('click', () => {
    sidebar.classList.toggle('open');
    overlay.style.display = sidebar.classList.contains('open') ? 'block' : 'none';
  });

  overlay.addEventListener('click', () => {
    sidebar.classList.remove('open');
    overlay.style.display = 'none';
  });

  navItems.forEach(item => {
    item.addEventListener('click', () => {
      const page = item.dataset.page;
      window.location.hash = `#/${page}`;
      // Close mobile sidebar
      sidebar.classList.remove('open');
      overlay.style.display = 'none';
    });
  });

  // Router
  function getRoute() {
    const hash = window.location.hash.slice(2) || 'dashboard';
    const parts = hash.split('/');
    return { page: parts[0], id: parts[1], sub: parts[2] };
  }

  function setActiveNav(page) {
    navItems.forEach(item => {
      item.classList.toggle('active', item.dataset.page === page);
    });
  }

  async function navigate() {
    const route = getRoute();
    setActiveNav(route.page);

    try {
      switch (route.page) {
        case 'dashboard': await renderDashboard(mainContent); break;
        case 'pipeline': await renderPipeline(mainContent); break;
        case 'deals':
          if (route.id) await renderDealDetail(mainContent, route.id);
          else await renderDealsList(mainContent);
          break;
        case 'contacts':
          if (route.id) await renderContactDetail(mainContent, route.id);
          else await renderContactsList(mainContent);
          break;
        case 'companies':
          if (route.id) await renderCompanyDetail(mainContent, route.id);
          else await renderCompaniesList(mainContent);
          break;
        case 'activities': await renderActivities(mainContent); break;
        default: await renderDashboard(mainContent); break;
      }
    } catch (err) {
      mainContent.innerHTML = `<div class="empty-state"><div class="empty-state-icon">\u26A0\uFE0F</div><div class="empty-state-text">Error: ${err.message}</div></div>`;
    }
  }

  window.addEventListener('hashchange', navigate);
  navigate();
});

// ==========================================
// Dashboard Page
// ==========================================
async function renderDashboard(container) {
  const data = await API.get('/api/dashboard');
  const m = data.metrics;

  container.innerHTML = `
    <div class="page-view">
      <div class="page-header">
        <div>
          <h1 class="page-title">Dashboard</h1>
          <p class="page-subtitle">Sales overview and key metrics</p>
        </div>
      </div>

      <div class="metrics-grid">
        <div class="metric-card">
          <div class="metric-label">Active Pipeline</div>
          <div class="metric-value" data-countup="${m.activePipelineValue}">${formatCurrency(m.activePipelineValue)}</div>
        </div>
        <div class="metric-card">
          <div class="metric-label">Won Revenue</div>
          <div class="metric-value" data-countup="${m.totalWonValue}">${formatCurrency(m.totalWonValue)}</div>
          <div class="metric-change positive">Win rate: ${m.winRate}%</div>
        </div>
        <div class="metric-card">
          <div class="metric-label">Closing This Month</div>
          <div class="metric-value" data-countup="${m.dealsClosingThisMonth}">${m.dealsClosingThisMonth}</div>
          <div class="metric-change">${formatCurrency(m.dealsClosingThisMonthValue)} value</div>
        </div>
        <div class="metric-card">
          <div class="metric-label">Total Contacts</div>
          <div class="metric-value" data-countup="${m.totalContacts}">${m.totalContacts}</div>
        </div>
      </div>

      <div class="charts-grid">
        <div class="card">
          <div class="card-header"><span class="card-title">Pipeline Funnel</span></div>
          <div class="card-body funnel-chart" id="funnelChart"></div>
        </div>
        <div class="card">
          <div class="card-header"><span class="card-title">Monthly Revenue</span></div>
          <div class="card-body bar-chart" id="barChart"></div>
        </div>
      </div>

      <div class="charts-grid">
        <div class="card">
          <div class="card-header"><span class="card-title">Top Contacts by Deal Value</span></div>
          <div class="card-body">
            ${data.topContacts.length === 0 ? '<div class="empty-state"><div class="empty-state-text">No deals yet</div></div>' :
              `<table><thead><tr><th>Contact</th><th>Company</th><th class="text-right">Deal Value</th></tr></thead><tbody>
              ${data.topContacts.map(c => `<tr class="clickable" onclick="window.location.hash='#/contacts/${c.id}'"><td>${c.name}</td><td>${c.company || '-'}</td><td class="text-right"><strong>${formatCurrency(c.totalValue)}</strong></td></tr>`).join('')}
              </tbody></table>`}
          </div>
        </div>
        <div class="card">
          <div class="card-header"><span class="card-title">Activity Summary</span></div>
          <div class="card-body">
            <div class="metrics-grid" style="grid-template-columns:repeat(2,1fr)">
              <div><div class="metric-label">\u{1F4DE} Calls</div><div class="metric-value" style="font-size:1.25rem">${data.activityStats.calls}</div></div>
              <div><div class="metric-label">\u{2709}\uFE0F Emails</div><div class="metric-value" style="font-size:1.25rem">${data.activityStats.emails}</div></div>
              <div><div class="metric-label">\u{1F4C5} Meetings</div><div class="metric-value" style="font-size:1.25rem">${data.activityStats.meetings}</div></div>
              <div><div class="metric-label">\u{1F4DD} Notes</div><div class="metric-value" style="font-size:1.25rem">${data.activityStats.notes}</div></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  // Render funnel chart
  renderFunnelChart(document.getElementById('funnelChart'), data.funnelData);
  // Render bar chart
  renderBarChart(document.getElementById('barChart'), data.monthlyRevenue);
  // Animate count-up
  animateCountUp();
}

// ==========================================
// Pipeline (Kanban) Page
// ==========================================
async function renderPipeline(container) {
  const data = await API.get('/api/pipeline');

  container.innerHTML = `
    <div class="page-view">
      <div class="page-header">
        <div>
          <h1 class="page-title">Pipeline</h1>
          <p class="page-subtitle">Drag deals between stages</p>
        </div>
        <button class="btn btn-primary" onclick="showDealModal()">+ New Deal</button>
      </div>
      <div class="pipeline-board" id="pipelineBoard">
        ${data.stages.map(stage => `
          <div class="pipeline-column" data-stage="${stage.stage}">
            <div class="pipeline-column-header">
              <div>
                <div class="pipeline-column-title">${stage.stage}</div>
                <div class="pipeline-column-value">${formatCurrency(stage.totalValue)}</div>
              </div>
              <span class="pipeline-column-count">${stage.count}</span>
            </div>
            <div class="pipeline-column-body" data-stage="${stage.stage}"
              ondragover="handleDragOver(event)"
              ondragenter="handleDragEnter(event)"
              ondragleave="handleDragLeave(event)"
              ondrop="handleDrop(event)">
              ${stage.deals.map(deal => `
                <div class="deal-card" draggable="true" data-deal-id="${deal.id}"
                  ondragstart="handleDragStart(event)"
                  ondragend="handleDragEnd(event)">
                  <div class="deal-card-title clickable" onclick="window.location.hash='#/deals/${deal.id}'">${deal.title}</div>
                  <div class="deal-card-value">${formatCurrency(deal.value)}</div>
                  <div class="deal-card-meta">
                    <span class="deal-card-contact">${deal.contact_name || 'No contact'}</span>
                    <div class="deal-card-badges">
                      <span class="${probBadgeClass(deal.probability)}">${deal.probability}%</span>
                      <span class="days-badge">${deal.days_in_stage}d</span>
                    </div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

// Drag and drop handlers
let draggedDealId = null;

function handleDragStart(e) {
  draggedDealId = e.target.dataset.dealId;
  e.target.classList.add('dragging');
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/plain', draggedDealId);
}

function handleDragEnd(e) {
  e.target.classList.remove('dragging');
  document.querySelectorAll('.pipeline-column-body').forEach(el => el.classList.remove('drag-over'));
}

function handleDragOver(e) {
  e.preventDefault();
  e.dataTransfer.dropEffect = 'move';
}

function handleDragEnter(e) {
  e.preventDefault();
  const colBody = e.target.closest('.pipeline-column-body');
  if (colBody) colBody.classList.add('drag-over');
}

function handleDragLeave(e) {
  const colBody = e.target.closest('.pipeline-column-body');
  if (colBody && !colBody.contains(e.relatedTarget)) {
    colBody.classList.remove('drag-over');
  }
}

async function handleDrop(e) {
  e.preventDefault();
  const colBody = e.target.closest('.pipeline-column-body');
  if (!colBody || !draggedDealId) return;

  colBody.classList.remove('drag-over');
  const newStage = colBody.dataset.stage;

  try {
    await API.put(`/api/deals/${draggedDealId}/stage`, { stage: newStage });
    await renderPipeline(document.getElementById('mainContent'));
  } catch (err) {
    alert('Error moving deal: ' + err.message);
  }
  draggedDealId = null;
}

// ==========================================
// Contacts List
// ==========================================
async function renderContactsList(container) {
  const data = await API.get('/api/contacts?limit=50');

  container.innerHTML = `
    <div class="page-view">
      <div class="page-header">
        <div>
          <h1 class="page-title">Contacts</h1>
          <p class="page-subtitle">${data.total} contacts</p>
        </div>
        <div class="flex gap-8">
          <button class="btn btn-secondary" onclick="handleExportContacts()">Export</button>
          <button class="btn btn-primary" onclick="showContactModal()">+ New Contact</button>
        </div>
      </div>
      <div class="table-container">
        <div class="table-toolbar">
          <input type="text" class="table-search" placeholder="Search contacts..." id="contactSearch" oninput="filterContactsTable(this.value)">
        </div>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Company</th>
              <th>Title</th>
              <th>Status</th>
              <th>Last Contacted</th>
            </tr>
          </thead>
          <tbody id="contactsTableBody">
            ${renderContactRows(data.items)}
          </tbody>
        </table>
        <div class="table-pagination">
          <span>Showing ${data.items.length} of ${data.total}</span>
        </div>
      </div>
    </div>
  `;
}

function renderContactRows(contacts) {
  return contacts.map(c => `
    <tr class="clickable" onclick="window.location.hash='#/contacts/${c.id}'">
      <td><strong>${c.name}</strong></td>
      <td>${c.email || '-'}</td>
      <td>${c.company || '-'}</td>
      <td>${c.title || '-'}</td>
      <td><span class="${statusBadgeClass(c.status)}">${c.status}</span></td>
      <td>${c.last_contacted ? timeAgo(c.last_contacted) : 'Never'}</td>
    </tr>
  `).join('');
}

async function filterContactsTable(query) {
  const data = await API.get(`/api/contacts?search=${encodeURIComponent(query)}&limit=50`);
  document.getElementById('contactsTableBody').innerHTML = renderContactRows(data.items);
}

// ==========================================
// Contact Detail
// ==========================================
async function renderContactDetail(container, id) {
  const contact = await API.get(`/api/contacts/${id}`);
  const timeline = await API.get(`/api/contacts/${id}/timeline`);
  const deals = await API.get(`/api/contacts/${id}/deals`);

  container.innerHTML = `
    <div class="page-view">
      <div class="breadcrumb">
        <a href="#/contacts">Contacts</a>
        <span class="breadcrumb-sep">/</span>
        <span class="breadcrumb-current">${contact.name}</span>
      </div>

      <div class="detail-grid">
        <div class="card">
          <div class="profile-card">
            <div class="profile-avatar">${getInitials(contact.name)}</div>
            <div class="profile-info">
              <div class="profile-name">${contact.name} <span class="${statusBadgeClass(contact.status)}">${contact.status}</span></div>
              <div class="profile-detail">${contact.title || ''} ${contact.company ? 'at ' + contact.company : ''}</div>
              <div class="profile-detail">${contact.email ? '\u{2709}\uFE0F ' + contact.email : ''}</div>
              <div class="profile-detail">${contact.phone ? '\u{1F4DE} ' + contact.phone : ''}</div>
              ${contact.tags && contact.tags.length ? `<div class="profile-tags">${contact.tags.map(t => `<span class="tag">${t}</span>`).join('')}</div>` : ''}
              ${contact.notes ? `<div class="profile-detail mt-16" style="color:var(--text)">${contact.notes}</div>` : ''}
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <span class="card-title">Linked Deals</span>
            <span style="font-size:0.75rem;color:var(--text-muted)">${deals.length} deal${deals.length !== 1 ? 's' : ''}</span>
          </div>
          <div class="card-body">
            ${deals.length === 0 ? '<div class="empty-state"><div class="empty-state-text">No deals linked</div></div>' :
              `<table><thead><tr><th>Deal</th><th>Value</th><th>Stage</th></tr></thead><tbody>
              ${deals.map(d => `<tr class="clickable" onclick="window.location.hash='#/deals/${d.id}'"><td>${d.title}</td><td>${formatCurrency(d.value)}</td><td><span class="${stageBadgeClass(d.stage)}">${d.stage}</span></td></tr>`).join('')}
              </tbody></table>`}
          </div>
        </div>

        <div class="card full-width">
          <div class="card-header">
            <span class="card-title">Activity Timeline</span>
            <button class="btn btn-sm btn-primary" onclick="showActivityModal('${id}')">+ Log Activity</button>
          </div>
          <div class="card-body">
            ${timeline.length === 0 ? '<div class="empty-state"><div class="empty-state-text">No activities yet</div></div>' :
              `<div class="timeline">
              ${timeline.map(item => `
                <div class="timeline-item">
                  <div class="timeline-dot timeline-dot-${item.type === 'activity' ? item.activity_type : item.type}"></div>
                  <div class="timeline-content">
                    <div class="timeline-subject">${item.type === 'deal_change' ? `Deal "${item.deal_title}" moved: ${item.from} \u2192 ${item.to}` : item.subject}</div>
                    ${item.description ? `<div class="timeline-description">${item.description}</div>` : ''}
                    <div class="timeline-time">${activityIcon(item.activity_type || item.type)} ${timeAgo(item.timestamp)}</div>
                  </div>
                </div>
              `).join('')}
              </div>`}
          </div>
        </div>
      </div>
    </div>
  `;
}

// ==========================================
// Companies List
// ==========================================
async function renderCompaniesList(container) {
  const data = await API.get('/api/companies?limit=50');

  container.innerHTML = `
    <div class="page-view">
      <div class="page-header">
        <div>
          <h1 class="page-title">Companies</h1>
          <p class="page-subtitle">${data.total} companies</p>
        </div>
        <button class="btn btn-primary" onclick="showCompanyModal()">+ New Company</button>
      </div>
      <div class="table-container">
        <div class="table-toolbar">
          <input type="text" class="table-search" placeholder="Search companies..." oninput="filterCompaniesTable(this.value)">
        </div>
        <table>
          <thead><tr><th>Company</th><th>Industry</th><th>Size</th><th class="text-right">Revenue</th></tr></thead>
          <tbody id="companiesTableBody">
            ${renderCompanyRows(data.items)}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function renderCompanyRows(companies) {
  return companies.map(c => `
    <tr class="clickable" onclick="window.location.hash='#/companies/${c.id}'">
      <td><div class="flex gap-8" style="align-items:center"><div class="company-logo" style="width:32px;height:32px;font-size:0.75rem">${getInitials(c.name)}</div><strong>${c.name}</strong></div></td>
      <td>${c.industry || '-'}</td>
      <td>${c.size || '-'}</td>
      <td class="text-right">${c.revenue ? formatCurrency(c.revenue) : '-'}</td>
    </tr>
  `).join('');
}

async function filterCompaniesTable(query) {
  const data = await API.get(`/api/companies?search=${encodeURIComponent(query)}&limit=50`);
  document.getElementById('companiesTableBody').innerHTML = renderCompanyRows(data.items);
}

// ==========================================
// Company Detail
// ==========================================
async function renderCompanyDetail(container, id) {
  const company = await API.get(`/api/companies/${id}`);

  container.innerHTML = `
    <div class="page-view">
      <div class="breadcrumb">
        <a href="#/companies">Companies</a>
        <span class="breadcrumb-sep">/</span>
        <span class="breadcrumb-current">${company.name}</span>
      </div>

      <div class="detail-grid">
        <div class="card">
          <div class="profile-card">
            <div class="company-logo">${getInitials(company.name)}</div>
            <div class="profile-info">
              <div class="profile-name">${company.name}</div>
              <div class="profile-detail">${company.industry || 'Unknown industry'} \u2022 ${company.size || 'Unknown size'}</div>
              <div class="profile-detail">${company.domain ? '\u{1F310} ' + company.domain : ''}</div>
              <div class="profile-detail">${company.revenue ? 'Revenue: ' + formatCurrency(company.revenue) : ''}</div>
              <div class="profile-detail mt-16" style="font-weight:600;color:var(--primary)">Total Deal Value: ${formatCurrency(company.totalDealValue)}</div>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-header"><span class="card-title">Contacts</span><span style="font-size:0.75rem;color:var(--text-muted)">${company.contacts.length}</span></div>
          <div class="card-body">
            ${company.contacts.length === 0 ? '<div class="empty-state"><div class="empty-state-text">No contacts</div></div>' :
              `<table><thead><tr><th>Name</th><th>Title</th><th>Status</th></tr></thead><tbody>
              ${company.contacts.map(c => `<tr class="clickable" onclick="window.location.hash='#/contacts/${c.id}'"><td>${c.name}</td><td>${c.title || '-'}</td><td><span class="${statusBadgeClass(c.status)}">${c.status}</span></td></tr>`).join('')}
              </tbody></table>`}
          </div>
        </div>

        <div class="card full-width">
          <div class="card-header"><span class="card-title">Deals</span><span style="font-size:0.75rem;color:var(--text-muted)">${company.deals.length}</span></div>
          <div class="card-body">
            ${company.deals.length === 0 ? '<div class="empty-state"><div class="empty-state-text">No deals</div></div>' :
              `<table><thead><tr><th>Deal</th><th class="text-right">Value</th><th>Stage</th><th>Probability</th></tr></thead><tbody>
              ${company.deals.map(d => `<tr class="clickable" onclick="window.location.hash='#/deals/${d.id}'"><td>${d.title}</td><td class="text-right">${formatCurrency(d.value)}</td><td><span class="${stageBadgeClass(d.stage)}">${d.stage}</span></td><td><span class="${probBadgeClass(d.probability)}">${d.probability}%</span></td></tr>`).join('')}
              </tbody></table>`}
          </div>
        </div>
      </div>
    </div>
  `;
}

// ==========================================
// Deals List
// ==========================================
async function renderDealsList(container) {
  const data = await API.get('/api/deals?limit=50');

  container.innerHTML = `
    <div class="page-view">
      <div class="page-header">
        <div>
          <h1 class="page-title">Deals</h1>
          <p class="page-subtitle">${data.total} deals</p>
        </div>
        <button class="btn btn-primary" onclick="showDealModal()">+ New Deal</button>
      </div>
      <div class="table-container">
        <div class="table-toolbar">
          <input type="text" class="table-search" placeholder="Search deals..." oninput="filterDealsTable(this.value)">
        </div>
        <table>
          <thead><tr><th>Deal</th><th class="text-right">Value</th><th>Stage</th><th>Probability</th><th>Close Date</th></tr></thead>
          <tbody id="dealsTableBody">
            ${renderDealRows(data.items)}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function renderDealRows(deals) {
  return deals.map(d => `
    <tr class="clickable" onclick="window.location.hash='#/deals/${d.id}'">
      <td><strong>${d.title}</strong></td>
      <td class="text-right">${formatCurrency(d.value)}</td>
      <td><span class="${stageBadgeClass(d.stage)}">${d.stage}</span></td>
      <td><span class="${probBadgeClass(d.probability)}">${d.probability}%</span></td>
      <td>${d.expected_close_date || '-'}</td>
    </tr>
  `).join('');
}

async function filterDealsTable(query) {
  const data = await API.get(`/api/deals?search=${encodeURIComponent(query)}&limit=50`);
  document.getElementById('dealsTableBody').innerHTML = renderDealRows(data.items);
}

// ==========================================
// Deal Detail
// ==========================================
async function renderDealDetail(container, id) {
  const deal = await API.get(`/api/deals/${id}`);

  container.innerHTML = `
    <div class="page-view">
      <div class="breadcrumb">
        <a href="#/deals">Deals</a>
        <span class="breadcrumb-sep">/</span>
        <span class="breadcrumb-current">${deal.title}</span>
      </div>

      <div class="detail-grid">
        <div class="card">
          <div class="card-body">
            <h2 style="margin-bottom:12px">${deal.title}</h2>
            <div class="metrics-grid" style="grid-template-columns:repeat(2,1fr)">
              <div><div class="metric-label">Value</div><div class="metric-value" style="font-size:1.5rem;color:var(--primary)">${formatCurrency(deal.value)}</div></div>
              <div><div class="metric-label">Stage</div><div style="margin-top:4px"><span class="${stageBadgeClass(deal.stage)}">${deal.stage}</span></div></div>
              <div><div class="metric-label">Probability</div><div style="margin-top:4px"><span class="${probBadgeClass(deal.probability)}">${deal.probability}%</span></div></div>
              <div><div class="metric-label">Expected Close</div><div style="margin-top:4px;font-weight:500">${deal.expected_close_date || 'Not set'}</div></div>
            </div>
            ${deal.notes ? `<div class="mt-16"><div class="metric-label">Notes</div><p style="font-size:0.875rem;margin-top:4px">${deal.notes}</p></div>` : ''}
            ${deal.contact ? `<div class="mt-16"><div class="metric-label">Contact</div><a href="#/contacts/${deal.contact.id}" style="font-size:0.875rem">${deal.contact.name}</a></div>` : ''}
            ${deal.company ? `<div class="mt-16"><div class="metric-label">Company</div><a href="#/companies/${deal.company.id}" style="font-size:0.875rem">${deal.company.name}</a></div>` : ''}
          </div>
        </div>

        <div class="card">
          <div class="card-header"><span class="card-title">Stage History</span></div>
          <div class="card-body">
            <div class="timeline">
              ${(deal.history || []).slice().reverse().map(h => `
                <div class="timeline-item">
                  <div class="timeline-dot timeline-dot-deal_change"></div>
                  <div class="timeline-content">
                    <div class="timeline-subject">${h.from ? `${h.from} \u2192 ${h.to}` : `Created in ${h.to}`}</div>
                    <div class="timeline-time">${timeAgo(h.timestamp)}</div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>

        <div class="card full-width">
          <div class="card-header"><span class="card-title">Activities</span></div>
          <div class="card-body">
            ${(!deal.activities || deal.activities.length === 0) ? '<div class="empty-state"><div class="empty-state-text">No activities</div></div>' :
              `<div class="timeline">
              ${deal.activities.map(a => `
                <div class="timeline-item">
                  <div class="timeline-dot timeline-dot-${a.type}"></div>
                  <div class="timeline-content">
                    <div class="timeline-subject">${a.subject}</div>
                    ${a.description ? `<div class="timeline-description">${a.description}</div>` : ''}
                    <div class="timeline-time">${activityIcon(a.type)} ${timeAgo(a.timestamp)}</div>
                  </div>
                </div>
              `).join('')}
              </div>`}
          </div>
        </div>
      </div>
    </div>
  `;
}

// ==========================================
// Activities Page
// ==========================================
async function renderActivities(container) {
  const data = await API.get('/api/activities?limit=100');

  container.innerHTML = `
    <div class="page-view">
      <div class="page-header">
        <div>
          <h1 class="page-title">Activities</h1>
          <p class="page-subtitle">${data.total} activities</p>
        </div>
        <button class="btn btn-primary" onclick="showActivityModal()">+ Log Activity</button>
      </div>
      <div class="card">
        <div class="card-body">
          ${data.items.length === 0 ? '<div class="empty-state"><div class="empty-state-text">No activities yet</div></div>' :
            `<div class="timeline">
            ${data.items.map(a => `
              <div class="timeline-item">
                <div class="timeline-dot timeline-dot-${a.type}"></div>
                <div class="timeline-content">
                  <div class="timeline-subject">${activityIcon(a.type)} ${a.subject}</div>
                  ${a.description ? `<div class="timeline-description">${a.description}</div>` : ''}
                  <div class="timeline-time">${timeAgo(a.timestamp)}</div>
                </div>
              </div>
            `).join('')}
            </div>`}
        </div>
      </div>
    </div>
  `;
}

// ==========================================
// Charts
// ==========================================
function renderFunnelChart(container, funnelData) {
  if (!container || !funnelData) return;
  const maxValue = Math.max(...funnelData.map(d => d.value), 1);
  const colors = ['#6366F1', '#2563EB', '#F59E0B', '#F97316', '#10B981', '#EF4444'];
  const h = 30;
  const gap = 6;
  const svgHeight = funnelData.length * (h + gap);

  let svg = `<svg viewBox="0 0 400 ${svgHeight}" style="width:100%">`;
  funnelData.forEach((d, i) => {
    const w = Math.max((d.value / maxValue) * 340, 20);
    const x = (400 - w) / 2;
    const y = i * (h + gap);
    svg += `<rect class="funnel-bar" x="${x}" y="${y}" width="${w}" height="${h}" rx="4" fill="${colors[i % colors.length]}" opacity="0.85"/>`;
    svg += `<text x="200" y="${y + h / 2 + 4}" text-anchor="middle" font-size="11" font-weight="600" fill="white">${d.stage}: ${formatCurrency(d.value)} (${d.count})</text>`;
  });
  svg += '</svg>';
  container.innerHTML = svg;
}

function renderBarChart(container, monthlyRevenue) {
  if (!container) return;
  const entries = Object.entries(monthlyRevenue || {}).sort((a, b) => a[0].localeCompare(b[0]));
  if (entries.length === 0) {
    container.innerHTML = '<div class="empty-state"><div class="empty-state-text">No revenue data</div></div>';
    return;
  }

  const maxVal = Math.max(...entries.map(e => e[1]), 1);
  const barW = Math.min(60, 360 / entries.length - 8);
  const chartW = entries.length * (barW + 8) + 40;
  const chartH = 180;

  let svg = `<svg viewBox="0 0 ${chartW} ${chartH}" style="width:100%">`;
  entries.forEach(([month, value], i) => {
    const barH = Math.max((value / maxVal) * 130, 4);
    const x = 20 + i * (barW + 8);
    const y = chartH - barH - 30;
    svg += `<rect class="bar-rect" x="${x}" y="${y}" width="${barW}" height="${barH}" rx="3" fill="#2563EB" opacity="0.85"/>`;
    svg += `<text x="${x + barW / 2}" y="${y - 4}" text-anchor="middle" font-size="9" fill="#64748B" font-weight="500">${formatCurrency(value)}</text>`;
    svg += `<text x="${x + barW / 2}" y="${chartH - 8}" text-anchor="middle" font-size="9" fill="#94A3B8">${month.slice(5)}</text>`;
  });
  svg += '</svg>';
  container.innerHTML = svg;
}

// ==========================================
// Count-up Animation
// ==========================================
function animateCountUp() {
  document.querySelectorAll('[data-countup]').forEach(el => {
    const target = parseFloat(el.dataset.countup);
    if (isNaN(target)) return;
    const isCurrency = el.textContent.startsWith('$');
    const duration = 800;
    const start = Date.now();

    function tick() {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(target * eased);

      if (isCurrency) el.textContent = formatCurrency(current);
      else el.textContent = current.toLocaleString();

      if (progress < 1) requestAnimationFrame(tick);
    }
    tick();
  });
}

// ==========================================
// Modals
// ==========================================
function showModal(title, bodyHtml, onSave) {
  const existing = document.querySelector('.modal-overlay');
  if (existing) existing.remove();

  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.innerHTML = `
    <div class="modal">
      <div class="modal-header">
        <span class="modal-title">${title}</span>
        <button class="modal-close" onclick="closeModal()">\u00D7</button>
      </div>
      <div class="modal-body">${bodyHtml}</div>
      <div class="modal-footer">
        <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
        <button class="btn btn-primary" id="modalSaveBtn">Save</button>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);
  requestAnimationFrame(() => overlay.classList.add('visible'));

  overlay.querySelector('#modalSaveBtn').addEventListener('click', () => {
    if (onSave) onSave();
  });

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });
}

function closeModal() {
  const overlay = document.querySelector('.modal-overlay');
  if (overlay) {
    overlay.classList.remove('visible');
    setTimeout(() => overlay.remove(), 200);
  }
}

function showContactModal() {
  showModal('New Contact', `
    <div class="form-row">
      <div class="form-group"><label class="form-label">Name *</label><input class="form-input" id="fName" required></div>
      <div class="form-group"><label class="form-label">Email</label><input class="form-input" id="fEmail" type="email"></div>
    </div>
    <div class="form-row">
      <div class="form-group"><label class="form-label">Phone</label><input class="form-input" id="fPhone"></div>
      <div class="form-group"><label class="form-label">Title</label><input class="form-input" id="fTitle"></div>
    </div>
    <div class="form-row">
      <div class="form-group"><label class="form-label">Company</label><input class="form-input" id="fCompany"></div>
      <div class="form-group"><label class="form-label">Status</label>
        <select class="form-select" id="fStatus"><option value="lead">Lead</option><option value="prospect">Prospect</option><option value="customer">Customer</option><option value="churned">Churned</option></select>
      </div>
    </div>
    <div class="form-group"><label class="form-label">Notes</label><textarea class="form-textarea" id="fNotes"></textarea></div>
  `, async () => {
    const name = document.getElementById('fName').value;
    if (!name) { alert('Name is required'); return; }
    try {
      await API.post('/api/contacts', {
        name, email: document.getElementById('fEmail').value,
        phone: document.getElementById('fPhone').value, title: document.getElementById('fTitle').value,
        company: document.getElementById('fCompany').value, status: document.getElementById('fStatus').value,
        notes: document.getElementById('fNotes').value
      });
      closeModal();
      window.location.hash = '#/contacts';
      await renderContactsList(document.getElementById('mainContent'));
    } catch (err) { alert(err.message); }
  });
}

function showDealModal() {
  showModal('New Deal', `
    <div class="form-group"><label class="form-label">Title *</label><input class="form-input" id="fDealTitle" required></div>
    <div class="form-row">
      <div class="form-group"><label class="form-label">Value ($)</label><input class="form-input" id="fDealValue" type="number"></div>
      <div class="form-group"><label class="form-label">Stage</label>
        <select class="form-select" id="fDealStage"><option>Lead</option><option>Qualified</option><option>Proposal</option><option>Negotiation</option><option>Closed Won</option><option>Closed Lost</option></select>
      </div>
    </div>
    <div class="form-row">
      <div class="form-group"><label class="form-label">Probability (%)</label><input class="form-input" id="fDealProb" type="number" min="0" max="100"></div>
      <div class="form-group"><label class="form-label">Expected Close Date</label><input class="form-input" id="fDealClose" type="date"></div>
    </div>
    <div class="form-group"><label class="form-label">Notes</label><textarea class="form-textarea" id="fDealNotes"></textarea></div>
  `, async () => {
    const title = document.getElementById('fDealTitle').value;
    if (!title) { alert('Title is required'); return; }
    try {
      await API.post('/api/deals', {
        title, value: parseFloat(document.getElementById('fDealValue').value) || 0,
        stage: document.getElementById('fDealStage').value,
        probability: parseInt(document.getElementById('fDealProb').value) || 0,
        expected_close_date: document.getElementById('fDealClose').value || null,
        notes: document.getElementById('fDealNotes').value
      });
      closeModal();
      const route = window.location.hash.includes('pipeline') ? 'pipeline' : 'deals';
      window.location.hash = `#/${route}`;
      if (route === 'pipeline') await renderPipeline(document.getElementById('mainContent'));
      else await renderDealsList(document.getElementById('mainContent'));
    } catch (err) { alert(err.message); }
  });
}

function showCompanyModal() {
  showModal('New Company', `
    <div class="form-group"><label class="form-label">Name *</label><input class="form-input" id="fCoName" required></div>
    <div class="form-row">
      <div class="form-group"><label class="form-label">Domain</label><input class="form-input" id="fCoDomain"></div>
      <div class="form-group"><label class="form-label">Industry</label><input class="form-input" id="fCoIndustry"></div>
    </div>
    <div class="form-row">
      <div class="form-group"><label class="form-label">Size</label><input class="form-input" id="fCoSize" placeholder="e.g. 51-200"></div>
      <div class="form-group"><label class="form-label">Revenue ($)</label><input class="form-input" id="fCoRevenue" type="number"></div>
    </div>
  `, async () => {
    const name = document.getElementById('fCoName').value;
    if (!name) { alert('Name is required'); return; }
    try {
      await API.post('/api/companies', {
        name, domain: document.getElementById('fCoDomain').value,
        industry: document.getElementById('fCoIndustry').value,
        size: document.getElementById('fCoSize').value,
        revenue: parseFloat(document.getElementById('fCoRevenue').value) || null
      });
      closeModal();
      window.location.hash = '#/companies';
      await renderCompaniesList(document.getElementById('mainContent'));
    } catch (err) { alert(err.message); }
  });
}

function showActivityModal(contactId) {
  showModal('Log Activity', `
    <div class="form-row">
      <div class="form-group"><label class="form-label">Type *</label>
        <select class="form-select" id="fActType"><option value="call">Call</option><option value="email">Email</option><option value="meeting">Meeting</option><option value="note">Note</option></select>
      </div>
      <div class="form-group"><label class="form-label">Subject *</label><input class="form-input" id="fActSubject"></div>
    </div>
    <div class="form-group"><label class="form-label">Description</label><textarea class="form-textarea" id="fActDesc"></textarea></div>
  `, async () => {
    const subject = document.getElementById('fActSubject').value;
    if (!subject) { alert('Subject is required'); return; }
    try {
      await API.post('/api/activities', {
        type: document.getElementById('fActType').value, subject,
        description: document.getElementById('fActDesc').value,
        contact_id: contactId || null
      });
      closeModal();
      // Re-render current page
      const route = window.location.hash.slice(2).split('/');
      if (route[0] === 'contacts' && route[1]) await renderContactDetail(document.getElementById('mainContent'), route[1]);
      else await renderActivities(document.getElementById('mainContent'));
    } catch (err) { alert(err.message); }
  });
}

async function handleExportContacts() {
  try {
    const res = await fetch('/api/export/contacts');
    const data = await res.json();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'contacts-export.json';
    a.click();
    URL.revokeObjectURL(url);
  } catch (err) { alert('Export failed: ' + err.message); }
}
