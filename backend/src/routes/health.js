const express = require('express');
const { checkPostgresHealth } = require('../db/postgres');
const { checkRedisHealth } = require('../db/redis');

const healthRouter = express.Router();

healthRouter.get('/', async (_req, res, next) => {
  try {
    const [postgres, redis] = await Promise.all([checkPostgresHealth(), checkRedisHealth()]);
    const isHealthy = postgres.status === 'up' && redis.status === 'up';

    return res.status(isHealthy ? 200 : 503).json({
      status: isHealthy ? 'ok' : 'degraded',
      service: 'nirvana-backend',
      timestamp: new Date().toISOString(),
      checks: {
        postgres,
        redis
      }
    });
  } catch (error) {
    return next(error);
  }
});

module.exports = { healthRouter };
