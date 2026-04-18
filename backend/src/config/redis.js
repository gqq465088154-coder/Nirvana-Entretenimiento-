const { createClient } = require('redis');

const redisUrl = process.env.REDIS_URL;
const healthTimeoutMs = Number(process.env.REDIS_HEALTH_TIMEOUT_MS || 1200);

const redisClient = redisUrl
  ? createClient({
      url: redisUrl,
      socket: {
        reconnectStrategy: (retries) => Math.min(retries * 100, 3000)
      }
    })
  : null;

if (redisClient) {
  redisClient.on('error', (error) => {
    console.error(JSON.stringify({ level: 'ERROR', timestamp: new Date().toISOString(), message: 'Redis error', meta: { error: error.message } }));
  });
}

async function checkRedis() {
  if (!redisClient) {
    return { connected: false, reason: 'REDIS_URL_NOT_SET' };
  }

  const check = async () => {
    if (!redisClient.isOpen) {
      await redisClient.connect();
    }
    await redisClient.ping();
    return { connected: true };
  };

  try {
    return await Promise.race([
      check(),
      new Promise((resolve) =>
        setTimeout(() => resolve({ connected: false, reason: 'REDIS_TIMEOUT' }), healthTimeoutMs)
      )
    ]);
  } catch (error) {
    return { connected: false, reason: error.message };
  }
}

module.exports = {
  redisClient,
  checkRedis
};
