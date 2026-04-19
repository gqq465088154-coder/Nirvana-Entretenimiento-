const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const authMiddleware = require('./middleware/auth');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');
const healthRoutes = require('./routes/health');
const authRoutes = require('./routes/auth');
const sportsbookRoutes = require('./routes/sportsbook');
const casinoRoutes = require('./routes/casino');
const { metricsRouter, metricsMiddleware } = require('./routes/metrics');

const app = express();
const authApiLimiter = rateLimit({
  windowMs: Number(process.env.AUTH_API_RATE_LIMIT_WINDOW_MS || 60_000),
  max: Number(process.env.AUTH_API_RATE_LIMIT_MAX || 120),
  standardHeaders: true,
  legacyHeaders: false
});

const authRouteLimiter = rateLimit({
  windowMs: Number(process.env.AUTH_ROUTE_RATE_LIMIT_WINDOW_MS || 60_000),
  max: Number(process.env.AUTH_ROUTE_RATE_LIMIT_MAX || 20),
  standardHeaders: true,
  legacyHeaders: false
});

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(
  morgan(':method :url :status :response-time ms', {
    skip: (_req, res) => res.statusCode < 400
  })
);

app.use(metricsMiddleware);

app.use('/api/health', healthRoutes);
app.use('/api/auth', authRouteLimiter, authRoutes);
app.use('/api/metrics', metricsRouter);
app.use('/api/sportsbook', authApiLimiter, authMiddleware, sportsbookRoutes);
app.use('/api/casino', authApiLimiter, authMiddleware, casinoRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
