const { Router } = require('express');
const store = require('../data/store');

const router = Router();

const VALID_TYPES = ['call', 'email', 'meeting', 'note'];

// List activities
router.get('/', (req, res) => {
  const { contact_id, deal_id, type, page, limit, sort, order } = req.query;
  const result = store.listActivities({
    contact_id, deal_id, type,
    page: parseInt(page) || 1,
    limit: parseInt(limit) || 50,
    sort: sort || 'timestamp',
    order: order || 'desc'
  });
  res.json(result);
});

// Get single activity
router.get('/:id', (req, res) => {
  const activity = store.getActivity(req.params.id);
  if (!activity) return res.status(404).json({ error: 'Activity not found' });

  // Enrich with contact and deal names
  const contact = activity.contact_id ? store.getContact(activity.contact_id) : null;
  const deal = activity.deal_id ? store.getDeal(activity.deal_id) : null;

  res.json({
    ...activity,
    contact_name: contact ? contact.name : null,
    deal_title: deal ? deal.title : null
  });
});

// Create activity
router.post('/', (req, res) => {
  if (!req.body.type) return res.status(400).json({ error: 'Type is required' });
  if (!VALID_TYPES.includes(req.body.type)) {
    return res.status(400).json({ error: `Type must be one of: ${VALID_TYPES.join(', ')}` });
  }
  if (!req.body.subject) return res.status(400).json({ error: 'Subject is required' });

  const activity = store.createActivity(req.body);
  res.status(201).json(activity);
});

// Delete activity
router.delete('/:id', (req, res) => {
  const deleted = store.deleteActivity(req.params.id);
  if (!deleted) return res.status(404).json({ error: 'Activity not found' });
  res.json({ deleted: true });
});

module.exports = router;
