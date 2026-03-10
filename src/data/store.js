// In-memory data store for CRM
const { v4: uuidv4 } = require('../utils/uuid');

class Store {
  constructor() {
    this.contacts = new Map();
    this.companies = new Map();
    this.deals = new Map();
    this.activities = new Map();
    this.dealHistory = new Map(); // dealId -> [{ stage, timestamp, from, to }]
    this.pipelineStages = [
      'Lead', 'Qualified', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost'
    ];
  }

  // --- Contacts ---
  createContact(data) {
    const id = uuidv4();
    const contact = {
      id,
      name: data.name || '',
      email: data.email || '',
      phone: data.phone || '',
      company: data.company || '',
      company_id: data.company_id || null,
      title: data.title || '',
      tags: data.tags || [],
      notes: data.notes || '',
      status: data.status || 'lead',
      last_contacted: data.last_contacted || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    this.contacts.set(id, contact);
    return contact;
  }

  getContact(id) {
    return this.contacts.get(id) || null;
  }

  listContacts({ search, status, page = 1, limit = 20, sort = 'name', order = 'asc' } = {}) {
    let results = Array.from(this.contacts.values());

    if (search) {
      const q = search.toLowerCase();
      results = results.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.company.toLowerCase().includes(q) ||
        c.title.toLowerCase().includes(q)
      );
    }

    if (status) {
      results = results.filter(c => c.status === status);
    }

    results.sort((a, b) => {
      const aVal = (a[sort] || '').toString().toLowerCase();
      const bVal = (b[sort] || '').toString().toLowerCase();
      return order === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    });

    const total = results.length;
    const start = (page - 1) * limit;
    const items = results.slice(start, start + limit);

    return { items, total, page, limit, pages: Math.ceil(total / limit) };
  }

  updateContact(id, data) {
    const contact = this.contacts.get(id);
    if (!contact) return null;
    const updated = { ...contact, ...data, id, updated_at: new Date().toISOString() };
    this.contacts.set(id, updated);
    return updated;
  }

  deleteContact(id) {
    return this.contacts.delete(id);
  }

  // --- Companies ---
  createCompany(data) {
    const id = uuidv4();
    const company = {
      id,
      name: data.name || '',
      domain: data.domain || '',
      industry: data.industry || '',
      size: data.size || '',
      revenue: data.revenue || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    this.companies.set(id, company);
    return company;
  }

  getCompany(id) {
    return this.companies.get(id) || null;
  }

  listCompanies({ search, page = 1, limit = 20, sort = 'name', order = 'asc' } = {}) {
    let results = Array.from(this.companies.values());

    if (search) {
      const q = search.toLowerCase();
      results = results.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.domain.toLowerCase().includes(q) ||
        c.industry.toLowerCase().includes(q)
      );
    }

    results.sort((a, b) => {
      const aVal = (a[sort] || '').toString().toLowerCase();
      const bVal = (b[sort] || '').toString().toLowerCase();
      return order === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    });

    const total = results.length;
    const start = (page - 1) * limit;
    const items = results.slice(start, start + limit);

    return { items, total, page, limit, pages: Math.ceil(total / limit) };
  }

  getCompanyContacts(companyId) {
    return Array.from(this.contacts.values()).filter(c => c.company_id === companyId);
  }

  getCompanyDeals(companyId) {
    return Array.from(this.deals.values()).filter(d => d.company_id === companyId);
  }

  updateCompany(id, data) {
    const company = this.companies.get(id);
    if (!company) return null;
    const updated = { ...company, ...data, id, updated_at: new Date().toISOString() };
    this.companies.set(id, updated);
    return updated;
  }

  deleteCompany(id) {
    return this.companies.delete(id);
  }

  // --- Deals ---
  createDeal(data) {
    const id = uuidv4();
    const now = new Date().toISOString();
    const deal = {
      id,
      title: data.title || '',
      value: data.value || 0,
      stage: data.stage || 'Lead',
      probability: data.probability || 0,
      expected_close_date: data.expected_close_date || null,
      contact_id: data.contact_id || null,
      company_id: data.company_id || null,
      notes: data.notes || '',
      stage_entered_at: now,
      created_at: now,
      updated_at: now
    };
    this.deals.set(id, deal);
    this.dealHistory.set(id, [{ stage: deal.stage, timestamp: now, from: null, to: deal.stage }]);
    return deal;
  }

  getDeal(id) {
    return this.deals.get(id) || null;
  }

  listDeals({ search, stage, page = 1, limit = 20, sort = 'title', order = 'asc' } = {}) {
    let results = Array.from(this.deals.values());

    if (search) {
      const q = search.toLowerCase();
      results = results.filter(d =>
        d.title.toLowerCase().includes(q) ||
        d.notes.toLowerCase().includes(q)
      );
    }

    if (stage) {
      results = results.filter(d => d.stage === stage);
    }

    results.sort((a, b) => {
      const aVal = (a[sort] || '').toString().toLowerCase();
      const bVal = (b[sort] || '').toString().toLowerCase();
      return order === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    });

    const total = results.length;
    const start = (page - 1) * limit;
    const items = results.slice(start, start + limit);

    return { items, total, page, limit, pages: Math.ceil(total / limit) };
  }

  updateDeal(id, data) {
    const deal = this.deals.get(id);
    if (!deal) return null;

    const now = new Date().toISOString();
    const oldStage = deal.stage;
    const newStage = data.stage || oldStage;

    const updated = { ...deal, ...data, id, updated_at: now };

    if (newStage !== oldStage) {
      updated.stage_entered_at = now;
      const history = this.dealHistory.get(id) || [];
      history.push({ stage: newStage, timestamp: now, from: oldStage, to: newStage });
      this.dealHistory.set(id, history);
    }

    this.deals.set(id, updated);
    return updated;
  }

  getDealHistory(id) {
    return this.dealHistory.get(id) || [];
  }

  deleteDeal(id) {
    this.dealHistory.delete(id);
    return this.deals.delete(id);
  }

  // --- Activities ---
  createActivity(data) {
    const id = uuidv4();
    const activity = {
      id,
      type: data.type || 'note', // call, email, meeting, note
      subject: data.subject || '',
      description: data.description || '',
      contact_id: data.contact_id || null,
      deal_id: data.deal_id || null,
      timestamp: data.timestamp || new Date().toISOString(),
      created_at: new Date().toISOString()
    };
    this.activities.set(id, activity);

    // Update contact's last_contacted
    if (activity.contact_id && this.contacts.has(activity.contact_id)) {
      const contact = this.contacts.get(activity.contact_id);
      contact.last_contacted = activity.timestamp;
      contact.updated_at = new Date().toISOString();
    }

    return activity;
  }

  getActivity(id) {
    return this.activities.get(id) || null;
  }

  listActivities({ contact_id, deal_id, type, page = 1, limit = 50, sort = 'timestamp', order = 'desc' } = {}) {
    let results = Array.from(this.activities.values());

    if (contact_id) results = results.filter(a => a.contact_id === contact_id);
    if (deal_id) results = results.filter(a => a.deal_id === deal_id);
    if (type) results = results.filter(a => a.type === type);

    results.sort((a, b) => {
      const aVal = a[sort] || '';
      const bVal = b[sort] || '';
      return order === 'desc' ? bVal.localeCompare(aVal) : aVal.localeCompare(bVal);
    });

    const total = results.length;
    const start = (page - 1) * limit;
    const items = results.slice(start, start + limit);

    return { items, total, page, limit, pages: Math.ceil(total / limit) };
  }

  deleteActivity(id) {
    return this.activities.delete(id);
  }
}

// Singleton store instance
const store = new Store();

module.exports = store;
