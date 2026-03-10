const { Router } = require('express');
const store = require('../data/store');

const router = Router();

// List contacts
router.get('/', (req, res) => {
  const { search, status, page, limit, sort, order } = req.query;
  const result = store.listContacts({
    search, status,
    page: parseInt(page) || 1,
    limit: parseInt(limit) || 20,
    sort: sort || 'name',
    order: order || 'asc'
  });
  res.json(result);
});

// Get single contact
router.get('/:id', (req, res) => {
  const contact = store.getContact(req.params.id);
  if (!contact) return res.status(404).json({ error: 'Contact not found' });
  res.json(contact);
});

// Get contact timeline (activities + deal history)
router.get('/:id/timeline', (req, res) => {
  const contact = store.getContact(req.params.id);
  if (!contact) return res.status(404).json({ error: 'Contact not found' });

  const activities = store.listActivities({ contact_id: req.params.id, limit: 100 });
  const deals = Array.from(store.deals.values()).filter(d => d.contact_id === req.params.id);

  const timeline = [];

  // Add activities
  activities.items.forEach(a => {
    timeline.push({ type: 'activity', activity_type: a.type, subject: a.subject, description: a.description, timestamp: a.timestamp, deal_id: a.deal_id });
  });

  // Add deal stage changes
  deals.forEach(deal => {
    const history = store.getDealHistory(deal.id);
    history.forEach(h => {
      if (h.from) {
        timeline.push({ type: 'deal_change', deal_title: deal.title, deal_id: deal.id, from: h.from, to: h.to, timestamp: h.timestamp });
      }
    });
  });

  // Sort by timestamp descending
  timeline.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  res.json(timeline);
});

// Get contact's deals
router.get('/:id/deals', (req, res) => {
  const contact = store.getContact(req.params.id);
  if (!contact) return res.status(404).json({ error: 'Contact not found' });

  const deals = Array.from(store.deals.values()).filter(d => d.contact_id === req.params.id);
  res.json(deals);
});

// Create contact
router.post('/', (req, res) => {
  if (!req.body.name) return res.status(400).json({ error: 'Name is required' });

  const validStatuses = ['lead', 'prospect', 'customer', 'churned'];
  if (req.body.status && !validStatuses.includes(req.body.status)) {
    return res.status(400).json({ error: `Status must be one of: ${validStatuses.join(', ')}` });
  }

  const contact = store.createContact(req.body);
  res.status(201).json(contact);
});

// Update contact
router.put('/:id', (req, res) => {
  const validStatuses = ['lead', 'prospect', 'customer', 'churned'];
  if (req.body.status && !validStatuses.includes(req.body.status)) {
    return res.status(400).json({ error: `Status must be one of: ${validStatuses.join(', ')}` });
  }

  const contact = store.updateContact(req.params.id, req.body);
  if (!contact) return res.status(404).json({ error: 'Contact not found' });
  res.json(contact);
});

// Delete contact
router.delete('/:id', (req, res) => {
  const deleted = store.deleteContact(req.params.id);
  if (!deleted) return res.status(404).json({ error: 'Contact not found' });
  res.json({ deleted: true });
});

module.exports = router;
