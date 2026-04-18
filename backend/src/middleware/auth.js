const jwt = require('jsonwebtoken');

function authMiddleware(req, _res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    const error = new Error('Missing Bearer token');
    error.status = 401;
    return next(error);
  }

  const token = authHeader.replace('Bearer ', '').trim();
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    const error = new Error('JWT_SECRET is not configured');
    error.status = 500;
    return next(error);
  }

  try {
    req.user = jwt.verify(token, secret);
    return next();
  } catch (_error) {
    const error = new Error('Invalid or expired token');
    error.status = 401;
    return next(error);
  }
}

module.exports = authMiddleware;
