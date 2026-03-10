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

describe('Business Logic Scenario', () => {
  let server, baseUrl;

  before((_, done) => {
    server = app.listen(0, () => {
      baseUrl = `http://localhost:${server.address().port}`;
      done();
    });
  });

  after((_, done) => { server.close(done); });

  it('Full sales workflow: create lead, log activities, move through pipeline, check dashboard', async () => {
    // Step 1: Create a company
    const companyRes = await request(baseUrl, 'POST', '/api/companies', {
      name: 'Test Sales Corp', industry: 'Finance'
    });
    assert.strictEqual(companyRes.status, 201);

    // Step 2: Create a contact
    const contactRes = await request(baseUrl, 'POST', '/api/contacts', {
      name: 'Sales Lead', email: 'sales@testcorp.com', company_id: companyRes.body.id, status: 'lead'
    });
    assert.strictEqual(contactRes.status, 201);

    // Step 3: Create a deal
    const dealRes = await request(baseUrl, 'POST', '/api/deals', {
      title: 'Test Sales Deal', value: 50000, stage: 'Lead',
      contact_id: contactRes.body.id, company_id: companyRes.body.id
    });
    assert.strictEqual(dealRes.status, 201);

    // Step 4: Log activities
    await request(baseUrl, 'POST', '/api/activities', {
      type: 'call', subject: 'Discovery call', contact_id: contactRes.body.id, deal_id: dealRes.body.id
    });
    await request(baseUrl, 'POST', '/api/activities', {
      type: 'email', subject: 'Follow-up email', contact_id: contactRes.body.id, deal_id: dealRes.body.id
    });

    // Step 5: Check contact timeline has activities
    const timelineRes = await request(baseUrl, 'GET', `/api/contacts/${contactRes.body.id}/timeline`);
    assert.strictEqual(timelineRes.status, 200);
    assert.ok(timelineRes.body.length >= 2);

    // Step 6: Move deal through stages
    await request(baseUrl, 'PUT', `/api/deals/${dealRes.body.id}/stage`, { stage: 'Qualified' });
    await request(baseUrl, 'PUT', `/api/deals/${dealRes.body.id}/stage`, { stage: 'Closed Won' });

    // Step 7: Check pipeline has the deal
    const pipelineRes = await request(baseUrl, 'GET', '/api/pipeline');
    assert.strictEqual(pipelineRes.status, 200);
    const wonStage = pipelineRes.body.stages.find(s => s.stage === 'Closed Won');
    assert.ok(wonStage.deals.some(d => d.id === dealRes.body.id));

    // Step 8: Check dashboard shows updated metrics
    const dashRes = await request(baseUrl, 'GET', '/api/dashboard');
    assert.strictEqual(dashRes.status, 200);
    assert.ok(dashRes.body.metrics.totalWonValue > 0);

    // Step 9: Search for the deal
    const searchRes = await request(baseUrl, 'GET', '/api/search?q=Test%20Sales');
    assert.strictEqual(searchRes.status, 200);
    assert.ok(searchRes.body.total > 0);

    // Step 10: Export contacts (should include our new contact)
    const exportRes = await request(baseUrl, 'GET', '/api/export/contacts');
    assert.strictEqual(exportRes.status, 200);
    assert.ok(exportRes.body.some(c => c.email === 'sales@testcorp.com'));
  });
});
