const { Router } = require('express');
const store = require('../data/store');

const router = Router();

const VALID_STAGES = ['Lead', 'Qualified', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost'];

// List deals
router.get('/', (req, res) => {
  const { search, stage, page, limit, sort, order } = req.query;
  const result = store.listDeals({
    search, stage,
    page: parseInt(page) || 1,
    limit: parseInt(limit) || 20,
    sort: sort || 'title',
    order: order || 'asc'
  });
  res.json(result);
});

// Get single deal
router.get('/:id', (req, res) => {
  const deal = store.getDeal(req.params.id);
  if (!deal) return res.status(404).json({ error: 'Deal not found' });

  // Enrich with contact, company, and history
  const contact = deal.contact_id ? store.getContact(deal.contact_id) : null;
  const company = deal.company_id ? store.getCompany(deal.company_id) : null;
  const history = store.getDealHistory(req.params.id);
  const activities = store.listActivities({ deal_id: req.params.id, limit: 100 });

  res.json({ ...deal, contact, company, history, activities: activities.items });
});

// Get deal history
router.get('/:id/history', (req, res) => {
  const deal = store.getDeal(req.params.id);
  if (!deal) return res.status(404).json({ error: 'Deal not found' });
  const history = store.getDealHistory(req.params.id);
  res.json(history);
});

// Create deal
router.post('/', (req, res) => {
  if (!req.body.title) return res.status(400).json({ error: 'Title is required' });

  if (req.body.stage && !VALID_STAGES.includes(req.body.stage)) {
    return res.status(400).json({ error: `Stage must be one of: ${VALID_STAGES.join(', ')}` });
  }

  const deal = store.createDeal(req.body);
  res.status(201).json(deal);
});

// Update deal (including stage transitions)
router.put('/:id', (req, res) => {
  if (req.body.stage && !VALID_STAGES.includes(req.body.stage)) {
    return res.status(400).json({ error: `Stage must be one of: ${VALID_STAGES.join(', ')}` });
  }

  const deal = store.updateDeal(req.params.id, req.body);
  if (!deal) return res.status(404).json({ error: 'Deal not found' });
  res.json(deal);
});

// Move deal to a new stage (convenience endpoint)
router.put('/:id/stage', (req, res) => {
  if (!req.body.stage) return res.status(400).json({ error: 'Stage is required' });
  if (!VALID_STAGES.includes(req.body.stage)) {
    return res.status(400).json({ error: `Stage must be one of: ${VALID_STAGES.join(', ')}` });
  }

  const deal = store.updateDeal(req.params.id, { stage: req.body.stage });
  if (!deal) return res.status(404).json({ error: 'Deal not found' });

  const history = store.getDealHistory(req.params.id);
  res.json({ deal, history });
});

// Delete deal
router.delete('/:id', (req, res) => {
  const deleted = store.deleteDeal(req.params.id);
  if (!deleted) return res.status(404).json({ error: 'Deal not found' });
  res.json({ deleted: true });
});

// Get pipeline stages
router.get('/meta/stages', (req, res) => {
  res.json({ stages: VALID_STAGES });
});

module.exports = router;
