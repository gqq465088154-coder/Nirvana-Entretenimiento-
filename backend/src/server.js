const express = require('express');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const { env } = require('./config/env');
const { connectRedis } = require('./db/redis');
const { authRouter } = require('./routes/auth');
const { sportsbookRouter } = require('./routes/sportsbook');
const { casinoRouter } = require('./routes/casino');
const { healthRouter } = require('./routes/health');
const { authenticateJwt } = require('./middleware/auth');
const { errorHandler, notFoundHandler } = require('./middleware/error-handler');
const { logger } = require('./utils/logger');

const app = express();
const authLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false
});
const protectedApiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 120,
  standardHeaders: true,
  legacyHeaders: false
});

app.use(helmet());
app.use(express.json({ limit: '1mb' }));
app.use((req, _res, next) => {
  logger.info('request_received', { method: req.method, path: req.originalUrl });
  next();
});

app.use('/api/health', healthRouter);
app.use('/api/auth', authLimiter, authRouter);
app.use('/api/sportsbook', protectedApiLimiter, authenticateJwt, sportsbookRouter);
app.use('/api/casino', protectedApiLimiter, authenticateJwt, casinoRouter);

app.use(notFoundHandler);
app.use(errorHandler);

async function startServer() {
  await connectRedis();

  app.listen(env.port, () => {
    logger.info('server_started', { url: `http://localhost:${env.port}`, nodeEnv: env.nodeEnv });
  });
}

startServer().catch((error) => {
  logger.error('server_start_failed', { error: error.message, stack: error.stack, code: error.code });
  process.exit(1);
});
