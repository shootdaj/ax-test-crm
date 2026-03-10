const { describe, it } = require('node:test');
const assert = require('node:assert');

describe('App Module', () => {
  it('should export an Express app', () => {
    const app = require('../../src/app');
    assert.ok(app, 'App should be exported');
    assert.strictEqual(typeof app.listen, 'function', 'App should have listen method');
    assert.strictEqual(typeof app.use, 'function', 'App should have use method');
  });

  it('should have GET handler for /health', () => {
    const app = require('../../src/app');
    const routes = app._router.stack
      .filter(layer => layer.route)
      .map(layer => ({
        path: layer.route.path,
        methods: Object.keys(layer.route.methods)
      }));
    const healthRoute = routes.find(r => r.path === '/health');
    assert.ok(healthRoute, '/health route should exist');
    assert.ok(healthRoute.methods.includes('get'), '/health should accept GET');
  });
});

describe('Error Handler', () => {
  it('should export a function', () => {
    const errorHandler = require('../../src/middleware/error-handler');
    assert.strictEqual(typeof errorHandler, 'function');
  });
});
