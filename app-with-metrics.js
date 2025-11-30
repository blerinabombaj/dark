const express = require('express');
const client = require('prom-client');

// v5+ CORRECT syntax
const register = new client.Registry();
client.collectDefaultMetrics({ register });

const app = express();
app.use(express.json());

let requestCount = new client.Counter({
  name: 'http_requests_total',
  help: 'Total HTTP requests',
  labelNames: ['method', 'route', 'status'],
  registers: [register]
});

// Health check
app.get('/health', (req, res) => res.status(200).send('OK'));

// Dark API routes
app.get('/api/products', (req, res) => {
  requestCount.inc({method: 'GET', route: '/api/products', status: 200});
  res.json({ products: [] });
});

app.post('/api/orders', (req, res) => {
  requestCount.inc({method: 'POST', route: '/api/orders', status: 201});
  res.status(201).json({ orderId: 123 });
});

app.get('/api/dashboard', (req, res) => {
  requestCount.inc({method: 'GET', route: '/api/dashboard', status: 200});
  res.json({ data: 'dark data' });
});

// Prometheus metrics endpoint
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Dark app running on port ${PORT}`);
  console.log(`Metrics: http://localhost:${PORT}/metrics`);
});
