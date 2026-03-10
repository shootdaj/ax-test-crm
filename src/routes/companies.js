const { Router } = require('express');
const store = require('../data/store');

const router = Router();

// List companies
router.get('/', (req, res) => {
  const { search, page, limit, sort, order } = req.query;
  const result = store.listCompanies({
    search,
    page: parseInt(page) || 1,
    limit: parseInt(limit) || 20,
    sort: sort || 'name',
    order: order || 'asc'
  });
  res.json(result);
});

// Get single company
router.get('/:id', (req, res) => {
  const company = store.getCompany(req.params.id);
  if (!company) return res.status(404).json({ error: 'Company not found' });

  // Enrich with contacts and deals
  const contacts = store.getCompanyContacts(req.params.id);
  const deals = store.getCompanyDeals(req.params.id);
  const totalDealValue = deals.reduce((sum, d) => sum + (d.value || 0), 0);

  res.json({ ...company, contacts, deals, totalDealValue });
});

// Create company
router.post('/', (req, res) => {
  if (!req.body.name) return res.status(400).json({ error: 'Name is required' });
  const company = store.createCompany(req.body);
  res.status(201).json(company);
});

// Update company
router.put('/:id', (req, res) => {
  const company = store.updateCompany(req.params.id, req.body);
  if (!company) return res.status(404).json({ error: 'Company not found' });
  res.json(company);
});

// Delete company
router.delete('/:id', (req, res) => {
  const deleted = store.deleteCompany(req.params.id);
  if (!deleted) return res.status(404).json({ error: 'Company not found' });
  res.json({ deleted: true });
});

module.exports = router;
