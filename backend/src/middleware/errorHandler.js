const logger = require('../utils/logger');

function notFoundHandler(req, _res, next) {
  const error = new Error(`Route not found: ${req.method} ${req.originalUrl}`);
  error.status = 404;
  next(error);
}

function errorHandler(error, req, res, _next) {
  const status = error.status || 500;
  logger.error(error.message, {
    status,
    route: `${req.method} ${req.originalUrl}`
  });

  res.status(status).json({
    error: {
      message: error.message,
      status
    }
  });
}

module.exports = {
  notFoundHandler,
  errorHandler
};
