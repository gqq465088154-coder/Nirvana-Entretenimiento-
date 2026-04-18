const express = require('express');
const { checkDatabase } = require('../config/database');
const { checkRedis } = require('../config/redis');

const router = express.Router();

router.get('/', async (_req, res) => {
  const checks = {};

  try {
    checks.postgres = await checkDatabase();
  } catch (error) {
    checks.postgres = { connected: false, reason: error.message };
  }

  try {
    checks.redis = await checkRedis();
  } catch (error) {
    checks.redis = { connected: false, reason: error.message };
  }

  const healthy = Object.values(checks).every((item) => item.connected || item.reason?.endsWith('_NOT_SET'));

  res.status(healthy ? 200 : 503).json({
    status: healthy ? 'ok' : 'degraded',
    service: 'nirvana-backend',
    timestamp: new Date().toISOString(),
    checks
  });
});

module.exports = router;
