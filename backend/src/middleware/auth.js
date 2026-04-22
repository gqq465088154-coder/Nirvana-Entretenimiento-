const jwt = require('jsonwebtoken');
const { env } = require('../config/env');

function authenticateJwt(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'missing_authorization_header' });
  }

  const token = authHeader.slice(7);

  try {
    const payload = jwt.verify(token, env.jwtSecret);
    req.user = payload;
    return next();
  } catch (_error) {
    return res.status(401).json({ error: 'invalid_or_expired_token' });
  }
}

module.exports = { authenticateJwt };
