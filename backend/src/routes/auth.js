const crypto = require('crypto');
const express = require('express');
const jwt = require('jsonwebtoken');
const { env } = require('../config/env');

const authRouter = express.Router();

// Constant-time comparison to prevent timing attacks on credential checks.
function safeEqual(a, b) {
  const bufA = Buffer.from(String(a));
  const bufB = Buffer.from(String(b));
  if (bufA.length !== bufB.length) {
    // Compare bufA against a same-length dummy so the timing is identical
    // regardless of which branch is taken.
    const dummy = Buffer.alloc(bufA.length);
    crypto.timingSafeEqual(bufA, dummy);
    return false;
  }
  return crypto.timingSafeEqual(bufA, bufB);
}

authRouter.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'username_and_password_required' });
  }

  const userMatch = safeEqual(username, env.authUser);
  const passMatch = safeEqual(password, env.authPassword);

  if (!userMatch || !passMatch) {
    return res.status(401).json({ error: 'invalid_credentials' });
  }

  const token = jwt.sign({ sub: username, role: 'operator' }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn
  });

  return res.status(200).json({
    accessToken: token,
    tokenType: 'Bearer',
    expiresIn: env.jwtExpiresIn
  });
});

module.exports = { authRouter };
