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
        try { resolve({ status: res.statusCode, body: JSON.parse(data) }); }
        catch { resolve({ status: res.statusCode, body: data }); }
      });
    });
    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

describe('Business Logic Integration Tests', () => {
  let server, baseUrl;

  before((_, done) => {
    server = app.listen(0, () => {
      baseUrl = `http://localhost:${server.address().port}`;
      done();
    });
  });

  after((_, done) => { server.close(done); });

  describe('Activities API', () => {
    it('POST /api/activities creates an activity', async () => {
      const contacts = await request(baseUrl, 'GET', '/api/contacts?limit=1');
      const contactId = contacts.body.items[0].id;

      const res = await request(baseUrl, 'POST', '/api/activities', {
        type: 'call', subject: 'Test call', description: 'Testing', contact_id: contactId
      });
      assert.strictEqual(res.status, 201);
      assert.strictEqual(res.body.type, 'call');
    });

    it('GET /api/activities lists activities', async () => {
      const res = await request(baseUrl, 'GET', '/api/activities');
      assert.strictEqual(res.status, 200);
      assert.ok(res.body.items.length > 0);
    });

    it('rejects invalid activity type', async () => {
      const res = await request(baseUrl, 'POST', '/api/activities', { type: 'invalid', subject: 'Test' });
      assert.strictEqual(res.status, 400);
    });
  });

  describe('Pipeline API', () => {
    it('GET /api/pipeline returns stage summaries', async () => {
      const res = await request(baseUrl, 'GET', '/api/pipeline');
      assert.strictEqual(res.status, 200);
      assert.ok(res.body.stages.length === 6);
      res.body.stages.forEach(stage => {
        assert.ok(stage.stage);
        assert.ok(typeof stage.count === 'number');
        assert.ok(typeof stage.totalValue === 'number');
        assert.ok(Array.isArray(stage.deals));
      });
    });

    it('GET /api/pipeline/analytics returns analytics', async () => {
      const res = await request(baseUrl, 'GET', '/api/pipeline/analytics');
      assert.strictEqual(res.status, 200);
      assert.ok(typeof res.body.activePipelineValue === 'number');
      assert.ok(typeof res.body.winRate === 'number');
      assert.ok(typeof res.body.avgCycleTime === 'number');
      assert.ok(Array.isArray(res.body.conversionRates));
      assert.ok(Array.isArray(res.body.valuePerStage));
    });
  });

  describe('Dashboard API', () => {
    it('GET /api/dashboard returns aggregated metrics', async () => {
      const res = await request(baseUrl, 'GET', '/api/dashboard');
      assert.strictEqual(res.status, 200);
      assert.ok(res.body.metrics);
      assert.ok(typeof res.body.metrics.activePipelineValue === 'number');
      assert.ok(typeof res.body.metrics.totalContacts === 'number');
      assert.ok(Array.isArray(res.body.topContacts));
      assert.ok(res.body.activityStats);
      assert.ok(Array.isArray(res.body.funnelData));
    });
  });

  describe('Search API', () => {
    it('GET /api/search?q=acme returns results across entities', async () => {
      const res = await request(baseUrl, 'GET', '/api/search?q=acme');
      assert.strictEqual(res.status, 200);
      assert.ok(res.body.contacts.length > 0 || res.body.companies.length > 0 || res.body.deals.length > 0);
      assert.ok(typeof res.body.total === 'number');
    });

    it('GET /api/search?q= returns empty results', async () => {
      const res = await request(baseUrl, 'GET', '/api/search?q=');
      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.body.contacts.length, 0);
    });
  });

  describe('Import/Export API', () => {
    it('GET /api/export/contacts returns contacts JSON', async () => {
      const res = await request(baseUrl, 'GET', '/api/export/contacts');
      assert.strictEqual(res.status, 200);
      assert.ok(Array.isArray(res.body));
      assert.ok(res.body.length >= 15);
      assert.ok(res.body[0].name);
    });

    it('POST /api/import/contacts imports contacts', async () => {
      const res = await request(baseUrl, 'POST', '/api/import/contacts', [
        { name: 'Import Test 1', email: 'import1@test.com' },
        { name: 'Import Test 2', email: 'import2@test.com' }
      ]);
      assert.strictEqual(res.status, 201);
      assert.strictEqual(res.body.imported, 2);
    });

    it('POST /api/import/contacts rejects non-array', async () => {
      const res = await request(baseUrl, 'POST', '/api/import/contacts', { name: 'Not Array' });
      assert.strictEqual(res.status, 400);
    });
  });
});
