const { describe, it, before, after } = require('node:test');
const assert = require('node:assert');
const http = require('node:http');
const app = require('../../src/app');

describe('Foundation Scenario: App starts and serves requests', () => {
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

  it('Full startup flow: health check, static files, SPA routing', (_, done) => {
    // Step 1: Health check
    http.get(`${baseUrl}/health`, (res) => {
      assert.strictEqual(res.statusCode, 200, 'Health should return 200');

      let healthData = '';
      res.on('data', chunk => healthData += chunk);
      res.on('end', () => {
        const health = JSON.parse(healthData);
        assert.strictEqual(health.status, 'ok');

        // Step 2: Static CSS file
        http.get(`${baseUrl}/css/styles.css`, (cssRes) => {
          assert.strictEqual(cssRes.statusCode, 200, 'CSS should be served');

          // Step 3: SPA fallback for unknown route
          http.get(`${baseUrl}/some/page`, (spaRes) => {
            assert.strictEqual(spaRes.statusCode, 200, 'SPA fallback should work');
            const ct = spaRes.headers['content-type'];
            assert.ok(ct.includes('text/html'), 'SPA fallback should return HTML');

            // Step 4: API 404 for unknown API route
            http.get(`${baseUrl}/api/nothing`, (apiRes) => {
              assert.strictEqual(apiRes.statusCode, 404, 'Unknown API should 404');
              done();
            });
          });
        });
      });
    });
  });
});
