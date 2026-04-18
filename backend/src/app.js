const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const authMiddleware = require('./middleware/auth');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');
const healthRoutes = require('./routes/health');
const authRoutes = require('./routes/auth');
const sportsbookRoutes = require('./routes/sportsbook');
const casinoRoutes = require('./routes/casino');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(
  morgan(':method :url :status :response-time ms', {
    skip: (_req, res) => res.statusCode < 400
  })
);

app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/sportsbook', authMiddleware, sportsbookRoutes);
app.use('/api/casino', authMiddleware, casinoRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
