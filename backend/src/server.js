const app = require('./app');
const logger = require('./utils/logger');

const port = Number(process.env.PORT || 4000);

/* Warn on missing critical environment variables in production */
if (process.env.NODE_ENV === 'production') {
  const required = ['JWT_SECRET', 'DATABASE_URL'];
  const missing = required.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    logger.error(`Missing required environment variables: ${missing.join(', ')}`);
    process.exit(1);
  }

  if (process.env.JWT_SECRET === 'change_this_for_production' || process.env.JWT_SECRET === 'nirvana_dev_secret') {
    logger.error('JWT_SECRET must be changed from the default value in production');
    process.exit(1);
  }
}

app.listen(port, () => {
  logger.info(`Nirvana backend listening on http://localhost:${port}`);
});
