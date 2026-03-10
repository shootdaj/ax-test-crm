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

describe('Full CRM Workflow Scenario', () => {
  let server, baseUrl;

  before((_, done) => {
    server = app.listen(0, () => {
      baseUrl = `http://localhost:${server.address().port}`;
      done();
    });
  });

  after((_, done) => { server.close(done); });

  it('Create company -> Create contact -> Create deal -> Move deal through pipeline', async () => {
    // Step 1: Create a company
    const companyRes = await request(baseUrl, 'POST', '/api/companies', {
      name: 'Workflow Corp', industry: 'SaaS', domain: 'workflow.com'
    });
    assert.strictEqual(companyRes.status, 201);
    const companyId = companyRes.body.id;

    // Step 2: Create a contact at that company
    const contactRes = await request(baseUrl, 'POST', '/api/contacts', {
      name: 'Jane Doe', email: 'jane@workflow.com', company_id: companyId, status: 'prospect'
    });
    assert.strictEqual(contactRes.status, 201);
    const contactId = contactRes.body.id;

    // Step 3: Create a deal linked to contact and company
    const dealRes = await request(baseUrl, 'POST', '/api/deals', {
      title: 'Workflow Enterprise License', value: 100000, stage: 'Lead',
      contact_id: contactId, company_id: companyId, probability: 10
    });
    assert.strictEqual(dealRes.status, 201);
    const dealId = dealRes.body.id;

    // Step 4: Move deal through pipeline stages
    const stages = ['Qualified', 'Proposal', 'Negotiation', 'Closed Won'];
    for (const stage of stages) {
      const res = await request(baseUrl, 'PUT', `/api/deals/${dealId}/stage`, { stage });
      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.body.deal.stage, stage);
    }

    // Step 5: Verify deal history has all transitions
    const histRes = await request(baseUrl, 'GET', `/api/deals/${dealId}/history`);
    assert.strictEqual(histRes.status, 200);
    assert.strictEqual(histRes.body.length, 5); // initial + 4 transitions

    // Step 6: Verify company shows the contact and deal
    const companyDetail = await request(baseUrl, 'GET', `/api/companies/${companyId}`);
    assert.strictEqual(companyDetail.status, 200);
    assert.ok(companyDetail.body.contacts.length >= 1);
    assert.ok(companyDetail.body.deals.length >= 1);
    assert.ok(companyDetail.body.totalDealValue >= 100000);
  });
});
