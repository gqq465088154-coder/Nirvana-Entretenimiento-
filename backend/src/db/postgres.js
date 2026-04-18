const { Pool } = require('pg');
const { env } = require('../config/env');
const { logger } = require('../utils/logger');

const postgresPool = new Pool({
  connectionString: env.postgresUrl,
  max: 10,
  idleTimeoutMillis: 10000,
  connectionTimeoutMillis: 3000
});

async function checkPostgresHealth() {
  try {
    await postgresPool.query('SELECT 1');
    return { status: 'up' };
  } catch (error) {
    logger.warn('postgres_health_check_failed', { error: error.message });
    return { status: 'down', error: error.message };
  }
}

module.exports = { postgresPool, checkPostgresHealth };
