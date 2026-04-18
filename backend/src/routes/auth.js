const express = require('express');
const jwt = require('jsonwebtoken');
const { env } = require('../config/env');

const authRouter = express.Router();

authRouter.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'username_and_password_required' });
  }

  if (username !== env.authUser || password !== env.authPassword) {
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
