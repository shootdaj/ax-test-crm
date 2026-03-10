const { describe, it } = require('node:test');
const assert = require('node:assert');

describe('Route Modules', () => {
  it('contacts route exports a Router', () => {
    const router = require('../../src/routes/contacts');
    assert.ok(router.stack || router.handle, 'Should export an Express router');
  });

  it('companies route exports a Router', () => {
    const router = require('../../src/routes/companies');
    assert.ok(router.stack || router.handle);
  });

  it('deals route exports a Router', () => {
    const router = require('../../src/routes/deals');
    assert.ok(router.stack || router.handle);
  });

  it('activities route exports a Router', () => {
    const router = require('../../src/routes/activities');
    assert.ok(router.stack || router.handle);
  });

  it('pipeline route exports a Router', () => {
    const router = require('../../src/routes/pipeline');
    assert.ok(router.stack || router.handle);
  });

  it('dashboard route exports a Router', () => {
    const router = require('../../src/routes/dashboard');
    assert.ok(router.stack || router.handle);
  });

  it('search route exports a Router', () => {
    const router = require('../../src/routes/search');
    assert.ok(router.stack || router.handle);
  });

  it('import-export route exports a Router', () => {
    const router = require('../../src/routes/import-export');
    assert.ok(router.stack || router.handle);
  });
});
