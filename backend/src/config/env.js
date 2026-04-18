const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(process.cwd(), 'backend/.env') });

const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || 4000),
  jwtSecret: process.env.JWT_SECRET || 'change-this-secret-in-production',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '2h',
  authUser: process.env.AUTH_USER || 'nirvana-admin',
  authPassword: process.env.AUTH_PASSWORD || 'nirvana-2026',
  postgresUrl: process.env.POSTGRES_URL || 'postgresql://nirvana:nirvana@postgres:5432/nirvana',
  redisUrl: process.env.REDIS_URL || 'redis://redis:6379'
};

module.exports = { env };
