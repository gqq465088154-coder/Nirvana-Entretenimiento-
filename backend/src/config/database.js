const { Pool } = require('pg');

const connectionString = process.env.DATABASE_URL;
const connectTimeoutMs = Number(process.env.DB_CONNECT_TIMEOUT_MS || 1200);
const healthTimeoutMs = Number(process.env.DB_HEALTH_TIMEOUT_MS || 1200);

const pool = new Pool({
  connectionString,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
  max: Number(process.env.DB_POOL_MAX || 10),
  connectionTimeoutMillis: connectTimeoutMs
});

async function checkDatabase() {
  if (!connectionString) {
    return { connected: false, reason: 'DATABASE_URL_NOT_SET' };
  }

  try {
    return await Promise.race([
      (async () => {
        await pool.query('SELECT 1');
        return { connected: true };
      })(),
      new Promise((resolve) =>
        setTimeout(() => resolve({ connected: false, reason: 'POSTGRES_TIMEOUT' }), healthTimeoutMs)
      )
    ]);
  } catch (error) {
    return { connected: false, reason: error.message };
  }
}

module.exports = {
  pool,
  checkDatabase
};
