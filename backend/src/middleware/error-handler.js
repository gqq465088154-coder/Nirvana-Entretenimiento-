const { logger } = require('../utils/logger');

function notFoundHandler(req, res) {
  res.status(404).json({
    error: 'not_found',
    path: req.originalUrl
  });
}

function errorHandler(error, req, res, _next) {
  logger.error('request_failed', {
    path: req.originalUrl,
    method: req.method,
    error: error.message
  });

  res.status(error.statusCode || 500).json({
    error: 'internal_server_error',
    message: error.publicMessage || 'Unexpected error'
  });
}

module.exports = { notFoundHandler, errorHandler };
