const { createClient } = require('redis');
const { env } = require('../config/env');
const { logger } = require('../utils/logger');

const redisClient = createClient({
  url: env.redisUrl,
  socket: {
    connectTimeout: 2000,
    reconnectStrategy: () => false
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
