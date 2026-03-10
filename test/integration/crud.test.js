const { describe, it, before, after } = require('node:test');
const assert = require('node:assert');
const http = require('node:http');
const app = require('../../src/app');

function request(baseUrl, method, path, body) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, baseUrl);
    const options = {
      method,
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      headers: { 'Content-Type': 'application/json' }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(data) });
        } catch {
          resolve({ status: res.statusCode, body: data });
        }
      });
    });

    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

describe('CRUD Integration Tests', () => {
  let server;
  let baseUrl;

  before((_, done) => {
    server = app.listen(0, () => {
      baseUrl = `http://localhost:${server.address().port}`;
      done();
    });
  });

  after((_, done) => {
    server.close(done);
  });

  describe('Contacts API', () => {
    it('GET /api/contacts returns seeded contacts', async () => {
      const res = await request(baseUrl, 'GET', '/api/contacts');
      assert.strictEqual(res.status, 200);
      assert.ok(res.body.items.length >= 15, `Expected >= 15 contacts, got ${res.body.items.length}`);
      assert.ok(res.body.total >= 15);
    });

    it('POST /api/contacts creates a new contact', async () => {
      const res = await request(baseUrl, 'POST', '/api/contacts', { name: 'Test Contact', email: 'test@new.com', status: 'prospect' });
      assert.strictEqual(res.status, 201);
      assert.strictEqual(res.body.name, 'Test Contact');
      assert.strictEqual(res.body.status, 'prospect');
      assert.ok(res.body.id);
    });

    it('POST /api/contacts rejects missing name', async () => {
      const res = await request(baseUrl, 'POST', '/api/contacts', { email: 'no-name@test.com' });
      assert.strictEqual(res.status, 400);
    });

    it('POST /api/contacts rejects invalid status', async () => {
      const res = await request(baseUrl, 'POST', '/api/contacts', { name: 'Bad', status: 'invalid' });
      assert.strictEqual(res.status, 400);
    });

    it('GET /api/contacts/:id returns a specific contact', async () => {
      const createRes = await request(baseUrl, 'POST', '/api/contacts', { name: 'Fetch Me' });
      const res = await request(baseUrl, 'GET', `/api/contacts/${createRes.body.id}`);
      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.body.name, 'Fetch Me');
    });

    it('PUT /api/contacts/:id updates a contact', async () => {
      const createRes = await request(baseUrl, 'POST', '/api/contacts', { name: 'Old' });
      const res = await request(baseUrl, 'PUT', `/api/contacts/${createRes.body.id}`, { name: 'Updated' });
      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.body.name, 'Updated');
    });

    it('DELETE /api/contacts/:id deletes a contact', async () => {
      const createRes = await request(baseUrl, 'POST', '/api/contacts', { name: 'Delete Me' });
      const res = await request(baseUrl, 'DELETE', `/api/contacts/${createRes.body.id}`);
      assert.strictEqual(res.status, 200);
      const getRes = await request(baseUrl, 'GET', `/api/contacts/${createRes.body.id}`);
      assert.strictEqual(getRes.status, 404);
    });

    it('GET /api/contacts?search=chen filters contacts', async () => {
      const res = await request(baseUrl, 'GET', '/api/contacts?search=chen');
      assert.strictEqual(res.status, 200);
      assert.ok(res.body.items.length >= 1);
      assert.ok(res.body.items[0].name.toLowerCase().includes('chen'));
    });
  });

  describe('Companies API', () => {
    it('GET /api/companies returns seeded companies', async () => {
      const res = await request(baseUrl, 'GET', '/api/companies');
      assert.strictEqual(res.status, 200);
      assert.ok(res.body.items.length >= 5);
    });

    it('POST/GET/PUT/DELETE lifecycle', async () => {
      // Create
      const createRes = await request(baseUrl, 'POST', '/api/companies', { name: 'Test Co', industry: 'Testing' });
      assert.strictEqual(createRes.status, 201);

      // Get
      const getRes = await request(baseUrl, 'GET', `/api/companies/${createRes.body.id}`);
      assert.strictEqual(getRes.status, 200);
      assert.strictEqual(getRes.body.name, 'Test Co');

      // Update
      const updateRes = await request(baseUrl, 'PUT', `/api/companies/${createRes.body.id}`, { name: 'Updated Co' });
      assert.strictEqual(updateRes.status, 200);
      assert.strictEqual(updateRes.body.name, 'Updated Co');

      // Delete
      const deleteRes = await request(baseUrl, 'DELETE', `/api/companies/${createRes.body.id}`);
      assert.strictEqual(deleteRes.status, 200);
    });
  });

  describe('Deals API', () => {
    it('GET /api/deals returns seeded deals', async () => {
      const res = await request(baseUrl, 'GET', '/api/deals');
      assert.strictEqual(res.status, 200);
      assert.ok(res.body.items.length >= 10);
    });

    it('POST /api/deals creates a deal', async () => {
      const res = await request(baseUrl, 'POST', '/api/deals', { title: 'New Deal', value: 50000, stage: 'Lead' });
      assert.strictEqual(res.status, 201);
      assert.strictEqual(res.body.title, 'New Deal');
      assert.strictEqual(res.body.value, 50000);
    });

    it('PUT /api/deals/:id/stage changes stage with history', async () => {
      const createRes = await request(baseUrl, 'POST', '/api/deals', { title: 'Stage Test', stage: 'Lead' });
      const stageRes = await request(baseUrl, 'PUT', `/api/deals/${createRes.body.id}/stage`, { stage: 'Qualified' });
      assert.strictEqual(stageRes.status, 200);
      assert.strictEqual(stageRes.body.deal.stage, 'Qualified');
      assert.ok(stageRes.body.history.length >= 2);
    });

    it('GET /api/deals/:id/history returns stage history', async () => {
      const createRes = await request(baseUrl, 'POST', '/api/deals', { title: 'History Test', stage: 'Lead' });
      await request(baseUrl, 'PUT', `/api/deals/${createRes.body.id}/stage`, { stage: 'Proposal' });
      const histRes = await request(baseUrl, 'GET', `/api/deals/${createRes.body.id}/history`);
      assert.strictEqual(histRes.status, 200);
      assert.ok(histRes.body.length >= 2);
    });

    it('rejects invalid stage', async () => {
      const res = await request(baseUrl, 'POST', '/api/deals', { title: 'Bad Stage', stage: 'InvalidStage' });
      assert.strictEqual(res.status, 400);
    });
  });
});
