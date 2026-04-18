const express = require('express');
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

app.use(helmet());
app.use(express.json({ limit: '1mb' }));
app.use((req, _res, next) => {
  logger.info('request_received', { method: req.method, path: req.originalUrl });
  next();
});

app.use('/api/health', healthRouter);
app.use('/api/auth', authRouter);
app.use('/api/sportsbook', authenticateJwt, sportsbookRouter);
app.use('/api/casino', authenticateJwt, casinoRouter);

app.use(notFoundHandler);
app.use(errorHandler);

async function startServer() {
  await connectRedis();

  app.listen(env.port, () => {
    logger.info('server_started', { url: `http://localhost:${env.port}`, nodeEnv: env.nodeEnv });
  });
}

startServer().catch((error) => {
  logger.error('server_start_failed', { error: error.message });
  process.exitCode = 1;
});
