const { describe, it, beforeEach } = require('node:test');
const assert = require('node:assert');

describe('Store', () => {
  let store;

  beforeEach(() => {
    // Re-require to get fresh store
    delete require.cache[require.resolve('../../src/data/store')];
    delete require.cache[require.resolve('../../src/data/seed')];
    store = require('../../src/data/store');
  });

  describe('Contacts', () => {
    it('should create a contact', () => {
      const contact = store.createContact({ name: 'Test User', email: 'test@example.com' });
      assert.ok(contact.id);
      assert.strictEqual(contact.name, 'Test User');
      assert.strictEqual(contact.email, 'test@example.com');
      assert.strictEqual(contact.status, 'lead');
    });

    it('should get a contact by id', () => {
      const created = store.createContact({ name: 'Test' });
      const found = store.getContact(created.id);
      assert.deepStrictEqual(found, created);
    });

    it('should return null for non-existent contact', () => {
      assert.strictEqual(store.getContact('nonexistent'), null);
    });

    it('should list contacts with pagination', () => {
      for (let i = 0; i < 5; i++) store.createContact({ name: `User ${i}` });
      const result = store.listContacts({ page: 1, limit: 3 });
      assert.strictEqual(result.items.length, 3);
      assert.strictEqual(result.total, 5);
      assert.strictEqual(result.pages, 2);
    });

    it('should filter contacts by search', () => {
      store.createContact({ name: 'Alice Smith', email: 'alice@test.com' });
      store.createContact({ name: 'Bob Jones', email: 'bob@test.com' });
      const result = store.listContacts({ search: 'alice' });
      assert.strictEqual(result.items.length, 1);
      assert.strictEqual(result.items[0].name, 'Alice Smith');
    });

    it('should filter contacts by status', () => {
      store.createContact({ name: 'Lead', status: 'lead' });
      store.createContact({ name: 'Customer', status: 'customer' });
      const result = store.listContacts({ status: 'customer' });
      assert.strictEqual(result.items.length, 1);
      assert.strictEqual(result.items[0].name, 'Customer');
    });

    it('should update a contact', () => {
      const contact = store.createContact({ name: 'Old Name' });
      const updated = store.updateContact(contact.id, { name: 'New Name' });
      assert.strictEqual(updated.name, 'New Name');
      assert.strictEqual(updated.id, contact.id);
    });

    it('should delete a contact', () => {
      const contact = store.createContact({ name: 'Delete Me' });
      assert.ok(store.deleteContact(contact.id));
      assert.strictEqual(store.getContact(contact.id), null);
    });
  });

  describe('Companies', () => {
    it('should create a company', () => {
      const company = store.createCompany({ name: 'Test Corp', industry: 'Tech' });
      assert.ok(company.id);
      assert.strictEqual(company.name, 'Test Corp');
    });

    it('should list companies with search', () => {
      store.createCompany({ name: 'Alpha Inc', domain: 'alpha.com' });
      store.createCompany({ name: 'Beta Corp', domain: 'beta.com' });
      const result = store.listCompanies({ search: 'alpha' });
      assert.strictEqual(result.items.length, 1);
    });

    it('should get company contacts', () => {
      const company = store.createCompany({ name: 'Test Corp' });
      store.createContact({ name: 'Employee', company_id: company.id });
      store.createContact({ name: 'Other', company_id: null });
      const contacts = store.getCompanyContacts(company.id);
      assert.strictEqual(contacts.length, 1);
      assert.strictEqual(contacts[0].name, 'Employee');
    });
  });

  describe('Deals', () => {
    it('should create a deal with initial history', () => {
      const deal = store.createDeal({ title: 'Big Deal', value: 50000, stage: 'Lead' });
      assert.ok(deal.id);
      assert.strictEqual(deal.value, 50000);
      assert.strictEqual(deal.stage, 'Lead');
      const history = store.getDealHistory(deal.id);
      assert.strictEqual(history.length, 1);
      assert.strictEqual(history[0].to, 'Lead');
    });

    it('should log stage transitions', () => {
      const deal = store.createDeal({ title: 'Deal', stage: 'Lead' });
      store.updateDeal(deal.id, { stage: 'Qualified' });
      store.updateDeal(deal.id, { stage: 'Proposal' });
      const history = store.getDealHistory(deal.id);
      assert.strictEqual(history.length, 3);
      assert.strictEqual(history[1].from, 'Lead');
      assert.strictEqual(history[1].to, 'Qualified');
      assert.strictEqual(history[2].from, 'Qualified');
      assert.strictEqual(history[2].to, 'Proposal');
    });

    it('should not log history when stage does not change', () => {
      const deal = store.createDeal({ title: 'Deal', stage: 'Lead' });
      store.updateDeal(deal.id, { notes: 'Updated notes' });
      const history = store.getDealHistory(deal.id);
      assert.strictEqual(history.length, 1); // only initial
    });

    it('should filter deals by stage', () => {
      store.createDeal({ title: 'A', stage: 'Lead' });
      store.createDeal({ title: 'B', stage: 'Qualified' });
      const result = store.listDeals({ stage: 'Lead' });
      assert.strictEqual(result.items.length, 1);
    });
  });

  describe('Activities', () => {
    it('should create an activity and update contact last_contacted', () => {
      const contact = store.createContact({ name: 'Test' });
      assert.strictEqual(contact.last_contacted, null);
      const activity = store.createActivity({ type: 'call', subject: 'Test call', contact_id: contact.id });
      assert.ok(activity.id);
      const updatedContact = store.getContact(contact.id);
      assert.ok(updatedContact.last_contacted);
    });

    it('should filter activities by contact_id', () => {
      const c1 = store.createContact({ name: 'C1' });
      const c2 = store.createContact({ name: 'C2' });
      store.createActivity({ type: 'call', contact_id: c1.id });
      store.createActivity({ type: 'email', contact_id: c2.id });
      const result = store.listActivities({ contact_id: c1.id });
      assert.strictEqual(result.items.length, 1);
    });
  });
});
