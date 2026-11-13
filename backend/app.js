const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('node:path');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const app = express();
app.disable('x-powered-by');
app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:3000' }));
app.use(express.json({ limit: '32kb' }));
app.get('/api/health', (req, res) => {
  const connected = mongoose.connection.readyState === 1;
  res.status(connected ? 200 : 503).json({
    status: connected ? 'ok' : 'unavailable',
    database: connected ? 'connected' : 'disconnected'
  });
});
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use(express.static(path.join(__dirname, '../frontend')));
app.use(notFound);
app.use(errorHandler);

module.exports = app;
