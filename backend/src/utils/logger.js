const { createLogger, format, transports } = require('winston');
const path = require('path');

const logDir = process.env.LOG_DIR || 'logs';

const logger = createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: format.combine(
    format.timestamp(),
    format.json()
  ),
  defaultMeta: { service: 'nirvana-backend' },
  transports: [
    new transports.Console({
      format: format.combine(
        format.timestamp(),
        format.json()
      )
    })
  ]
});

/* In production, also write to rotating log files */
if (process.env.NODE_ENV === 'production') {
  logger.add(new transports.File({
    filename: path.join(logDir, 'error.log'),
    level: 'error',
    maxsize: 10 * 1024 * 1024,
    maxFiles: 5
  }));
  logger.add(new transports.File({
    filename: path.join(logDir, 'combined.log'),
    maxsize: 10 * 1024 * 1024,
    maxFiles: 10
  }));
}

module.exports = logger;
