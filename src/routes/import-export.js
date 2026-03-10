const { Router } = require('express');
const store = require('../data/store');

const router = Router();

// Export contacts as JSON
router.get('/contacts', (req, res) => {
  const contacts = Array.from(store.contacts.values()).map(c => ({
    name: c.name,
    email: c.email,
    phone: c.phone,
    company: c.company,
    title: c.title,
    tags: c.tags,
    notes: c.notes,
    status: c.status
  }));

  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', 'attachment; filename=contacts-export.json');
  res.json(contacts);
});

// Import contacts from JSON
router.post('/contacts', (req, res) => {
  if (!Array.isArray(req.body)) {
    return res.status(400).json({ error: 'Request body must be an array of contacts' });
  }

  const results = { imported: 0, errors: [] };

  req.body.forEach((contact, index) => {
    if (!contact.name) {
      results.errors.push({ index, error: 'Name is required' });
      return;
    }

    const validStatuses = ['lead', 'prospect', 'customer', 'churned'];
    if (contact.status && !validStatuses.includes(contact.status)) {
      contact.status = 'lead';
    }

    store.createContact(contact);
    results.imported++;
  });

  res.status(201).json(results);
});

module.exports = router;
