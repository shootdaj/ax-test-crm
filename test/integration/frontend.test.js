const { describe, it, before, after } = require('node:test');
const assert = require('node:assert');
const http = require('node:http');
const app = require('../../src/app');

function request(baseUrl, method, path) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, baseUrl);
    const options = { method, hostname: url.hostname, port: url.port, path: url.pathname + url.search };
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, body: data, headers: res.headers }));
    });
    req.on('error', reject);
    req.end();
  });
}

describe('Frontend Integration Tests', () => {
  let server, baseUrl;

  before((_, done) => {
    server = app.listen(0, () => {
      baseUrl = `http://localhost:${server.address().port}`;
      done();
    });
  });

  after((_, done) => { server.close(done); });

  it('GET / returns HTML with SPA shell', async () => {
    const res = await request(baseUrl, 'GET', '/');
    assert.strictEqual(res.status, 200);
    assert.ok(res.headers['content-type'].includes('text/html'));
    assert.ok(res.body.includes('SalesPipe CRM'));
    assert.ok(res.body.includes('id="app"'));
  });

  it('GET /css/styles.css returns CSS with primary color', async () => {
    const res = await request(baseUrl, 'GET', '/css/styles.css');
    assert.strictEqual(res.status, 200);
    assert.ok(res.body.includes('#2563EB'));
    assert.ok(res.body.includes('--primary'));
  });

  it('GET /js/app.js returns JavaScript with SPA router', async () => {
    const res = await request(baseUrl, 'GET', '/js/app.js');
    assert.strictEqual(res.status, 200);
    assert.ok(res.body.includes('renderDashboard'));
    assert.ok(res.body.includes('renderPipeline'));
    assert.ok(res.body.includes('handleDragStart'));
  });

  it('GET /js/api.js returns API client', async () => {
    const res = await request(baseUrl, 'GET', '/js/api.js');
    assert.strictEqual(res.status, 200);
    assert.ok(res.body.includes('formatCurrency'));
    assert.ok(res.body.includes('API'));
  });

  it('SPA fallback serves index.html for unknown routes', async () => {
    const res = await request(baseUrl, 'GET', '/some/unknown/route');
    assert.strictEqual(res.status, 200);
    assert.ok(res.headers['content-type'].includes('text/html'));
    assert.ok(res.body.includes('SalesPipe CRM'));
  });
});
