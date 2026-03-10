const { Router } = require('express');
const store = require('../data/store');

const router = Router();

router.get('/', (req, res) => {
  const { q } = req.query;
  if (!q || q.trim().length === 0) {
    return res.json({ contacts: [], companies: [], deals: [] });
  }

  const query = q.toLowerCase().trim();

  // Search contacts
  const contacts = Array.from(store.contacts.values())
    .filter(c =>
      c.name.toLowerCase().includes(query) ||
      c.email.toLowerCase().includes(query) ||
      c.company.toLowerCase().includes(query) ||
      c.title.toLowerCase().includes(query) ||
      (c.tags || []).some(t => t.toLowerCase().includes(query))
    )
    .slice(0, 10)
    .map(c => ({
      id: c.id,
      name: c.name,
      email: c.email,
      company: c.company,
      status: c.status,
      type: 'contact'
    }));

  // Search companies
  const companies = Array.from(store.companies.values())
    .filter(c =>
      c.name.toLowerCase().includes(query) ||
      c.domain.toLowerCase().includes(query) ||
      c.industry.toLowerCase().includes(query)
    )
    .slice(0, 10)
    .map(c => ({
      id: c.id,
      name: c.name,
      domain: c.domain,
      industry: c.industry,
      type: 'company'
    }));

  // Search deals
  const deals = Array.from(store.deals.values())
    .filter(d =>
      d.title.toLowerCase().includes(query) ||
      d.notes.toLowerCase().includes(query)
    )
    .slice(0, 10)
    .map(d => ({
      id: d.id,
      title: d.title,
      value: d.value,
      stage: d.stage,
      type: 'deal'
    }));

  res.json({
    contacts,
    companies,
    deals,
    total: contacts.length + companies.length + deals.length
  });
});

module.exports = router;
