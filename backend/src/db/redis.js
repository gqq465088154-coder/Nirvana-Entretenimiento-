const { createClient } = require('redis');
const { env } = require('../config/env');
const { logger } = require('../utils/logger');

const redisClient = createClient({
  url: env.redisUrl,
  socket: {
    connectTimeout: 2000,
    // Reconnect with exponential backoff, capped at 5 retries (max ~16 s delay).
    reconnectStrategy: (retries) => {
      if (retries >= 5) {
        return false;
      }
      return Math.min(retries * 500, 2000);
    }
  }
});
let redisReady = false;

redisClient.on('error', (error) => {
  redisReady = false;
  logger.warn('redis_client_error', { error: error.message });
});

redisClient.on('ready', () => {
  redisReady = true;
  logger.info('redis_client_ready');
});

async function connectRedis() {
  if (redisClient.isOpen) {
    return;
  }

  try {
    await redisClient.connect();
  } catch (error) {
    logger.warn('redis_connect_failed', { error: error.message });
  }
}

async function checkRedisHealth() {
  if (!redisClient.isOpen) {
    return { status: 'down', error: 'not_connected' };
  }

  try {
    await redisClient.ping();
    return { status: redisReady ? 'up' : 'degraded' };
  } catch (error) {
    return { status: 'down', error: error.message };
  }
}

module.exports = { redisClient, connectRedis, checkRedisHealth };
