const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(process.cwd(), 'backend/.env') });

const DEFAULT_JWT_SECRET = 'change-this-secret-in-production';
const DEFAULT_AUTH_PASSWORD = 'nirvana-2026';

const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || 4000),
  jwtSecret: process.env.JWT_SECRET || DEFAULT_JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '2h',
  authUser: process.env.AUTH_USER || 'nirvana-admin',
  authPassword: process.env.AUTH_PASSWORD || DEFAULT_AUTH_PASSWORD,
  postgresUrl: process.env.POSTGRES_URL || 'postgresql://nirvana:nirvana@postgres:5432/nirvana',
  redisUrl: process.env.REDIS_URL || 'redis://redis:6379'
};

// Warn loudly (and fail in strict mode) when default secrets are in use for production.
if (env.nodeEnv === 'production') {
  const insecure = [];
  if (env.jwtSecret === DEFAULT_JWT_SECRET) insecure.push('JWT_SECRET');
  if (env.authPassword === DEFAULT_AUTH_PASSWORD) insecure.push('AUTH_PASSWORD');
  if (insecure.length > 0) {
    const msg = `[SECURITY] Production is using default credentials: ${insecure.join(', ')}. Set strong secrets via environment variables.`;
    console.error(msg);
    if (process.env.STRICT_SECRETS === 'true') {
      process.exit(1);
    }
  }
}

module.exports = { env };
