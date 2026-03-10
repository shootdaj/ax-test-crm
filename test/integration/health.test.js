const { describe, it, before, after } = require('node:test');
const assert = require('node:assert');
const http = require('node:http');
const app = require('../../src/app');

describe('Health Endpoint Integration', () => {
  let server;
  let baseUrl;

  before((_, done) => {
    server = app.listen(0, () => {
      const port = server.address().port;
      baseUrl = `http://localhost:${port}`;
      done();
    });
  });

  after((_, done) => {
    server.close(done);
  });

  it('GET /health returns 200 with status ok', (_, done) => {
    http.get(`${baseUrl}/health`, (res) => {
      assert.strictEqual(res.statusCode, 200);

      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const body = JSON.parse(data);
        assert.strictEqual(body.status, 'ok');
        assert.ok(body.timestamp, 'Should include timestamp');
        assert.ok(typeof body.uptime === 'number', 'Should include uptime');
        done();
      });
    });
  });

  it('GET /api/nonexistent returns 404', (_, done) => {
    http.get(`${baseUrl}/api/nonexistent`, (res) => {
      assert.strictEqual(res.statusCode, 404);
      done();
    });
  });

  it('GET / returns HTML (SPA fallback)', (_, done) => {
    http.get(`${baseUrl}/`, (res) => {
      assert.strictEqual(res.statusCode, 200);
      const contentType = res.headers['content-type'];
      assert.ok(contentType.includes('text/html'), `Should return HTML, got ${contentType}`);
      done();
    });
  });
});
