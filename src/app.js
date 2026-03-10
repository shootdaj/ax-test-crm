const express = require('express');
const path = require('path');
const errorHandler = require('./middleware/error-handler');
const { seed } = require('./data/seed');

const app = express();

// Initialize seed data
seed();

// Middleware
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

// CORS headers for API
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Health endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API routes
app.use('/api/contacts', require('./routes/contacts'));
app.use('/api/companies', require('./routes/companies'));
app.use('/api/deals', require('./routes/deals'));
app.use('/api/activities', require('./routes/activities'));
app.use('/api/pipeline', require('./routes/pipeline'));
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/search', require('./routes/search'));
app.use('/api/import', require('./routes/import-export'));
app.use('/api/export', require('./routes/import-export'));

// Serve static files
app.use(express.static(path.join(__dirname, '..', 'public')));

// SPA fallback - serve index.html for non-API routes
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api/')) {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
  } else {
    res.status(404).json({ error: 'API endpoint not found' });
  }
});

// Error handling
app.use(errorHandler);

module.exports = app;
