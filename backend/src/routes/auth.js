const express = require('express');
const jwt = require('jsonwebtoken');

const router = express.Router();

router.post('/token', (req, res, next) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    const error = new Error('JWT_SECRET is not configured');
    error.status = 500;
    return next(error);
  }

  const { userId = 'demo-user', role = 'player' } = req.body || {};

  const token = jwt.sign({ sub: userId, role }, secret, {
    expiresIn: '12h',
    issuer: 'nirvana-backend'
  });

  res.status(200).json({ token, tokenType: 'Bearer', expiresIn: '12h' });
});

module.exports = router;
