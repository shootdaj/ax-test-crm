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
        try { resolve({ status: res.statusCode, body: JSON.parse(data), raw: data }); }
        catch { resolve({ status: res.statusCode, body: null, raw: data }); }
      });
    });
    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

describe('Frontend SPA Scenario', () => {
  let server, baseUrl;

  before((_, done) => {
    server = app.listen(0, () => {
      baseUrl = `http://localhost:${server.address().port}`;
      done();
    });
  });

  after((_, done) => { server.close(done); });

  it('Full SPA flow: load app, fetch dashboard data, navigate to contacts, view detail, check pipeline', async () => {
    // Step 1: Load the SPA HTML
    const htmlRes = await request(baseUrl, 'GET', '/');
    assert.strictEqual(htmlRes.status, 200);
    assert.ok(htmlRes.raw.includes('SalesPipe'));

    // Step 2: Dashboard API call (frontend would make this)
    const dashRes = await request(baseUrl, 'GET', '/api/dashboard');
    assert.strictEqual(dashRes.status, 200);
    assert.ok(dashRes.body.metrics.totalContacts >= 15);
    assert.ok(dashRes.body.funnelData.length === 6);

    // Step 3: Contacts list (frontend navigates to #/contacts)
    const contactsRes = await request(baseUrl, 'GET', '/api/contacts?limit=20');
    assert.strictEqual(contactsRes.status, 200);
    assert.ok(contactsRes.body.items.length >= 15);
    const firstContact = contactsRes.body.items[0];

    // Step 4: Contact detail page data
    const detailRes = await request(baseUrl, 'GET', `/api/contacts/${firstContact.id}`);
    assert.strictEqual(detailRes.status, 200);
    assert.ok(detailRes.body.name);

    // Step 5: Contact timeline
    const timelineRes = await request(baseUrl, 'GET', `/api/contacts/${firstContact.id}/timeline`);
    assert.strictEqual(timelineRes.status, 200);
    assert.ok(Array.isArray(timelineRes.body));

    // Step 6: Pipeline board data
    const pipelineRes = await request(baseUrl, 'GET', '/api/pipeline');
    assert.strictEqual(pipelineRes.status, 200);
    assert.strictEqual(pipelineRes.body.stages.length, 6);
    // At least some stages should have deals
    const totalDeals = pipelineRes.body.stages.reduce((s, st) => s + st.count, 0);
    assert.ok(totalDeals >= 10);

    // Step 7: Pipeline analytics
    const analyticsRes = await request(baseUrl, 'GET', '/api/pipeline/analytics');
    assert.strictEqual(analyticsRes.status, 200);
    assert.ok(analyticsRes.body.totalDeals >= 10);
  });
});
