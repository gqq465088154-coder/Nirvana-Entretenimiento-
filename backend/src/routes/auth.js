const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const { pool } = require('../config/database');

const router = express.Router();

const SALT_ROUNDS = 12;
const ACCESS_TOKEN_EXPIRY = '1h';
const REFRESH_TOKEN_EXPIRY_DAYS = 7;

function getSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    const error = new Error('JWT_SECRET is not configured');
    error.status = 500;
    throw error;
  }
  return secret;
}

function signAccessToken(payload, secret) {
  return jwt.sign(payload, secret, {
    expiresIn: ACCESS_TOKEN_EXPIRY,
    issuer: 'nirvana-backend'
  });
}

/* POST /api/auth/register */
router.post('/register', async (req, res, next) => {
  try {
    const secret = getSecret();
    const { username, email, password } = req.body || {};

    if (!username || !email || !password) {
      const error = new Error('username, email and password are required');
      error.status = 400;
      return next(error);
    }

    if (password.length < 8) {
      const error = new Error('password must be at least 8 characters');
      error.status = 400;
      return next(error);
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    const result = await pool.query(
      'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id, username, email, role, created_at',
      [username, email, passwordHash]
    );

    const user = result.rows[0];
    const token = signAccessToken({ sub: user.id.toString(), role: user.role }, secret);

    const refreshToken = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + REFRESH_TOKEN_EXPIRY_DAYS * 24 * 60 * 60 * 1000);
    await pool.query(
      'INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)',
      [user.id, refreshToken, expiresAt]
    );

    return res.status(201).json({
      user: { id: user.id, username: user.username, email: user.email, role: user.role },
      token,
      refreshToken,
      tokenType: 'Bearer',
      expiresIn: ACCESS_TOKEN_EXPIRY
    });
  } catch (error) {
    if (error.code === '23505') {
      const err = new Error('username or email already exists');
      err.status = 409;
      return next(err);
    }
    return next(error);
  }
});

/* POST /api/auth/login */
router.post('/login', async (req, res, next) => {
  try {
    const secret = getSecret();
    const { email, password } = req.body || {};

    if (!email || !password) {
      const error = new Error('email and password are required');
      error.status = 400;
      return next(error);
    }

    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      const error = new Error('invalid email or password');
      error.status = 401;
      return next(error);
    }

    const token = signAccessToken({ sub: user.id.toString(), role: user.role }, secret);

    const refreshToken = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + REFRESH_TOKEN_EXPIRY_DAYS * 24 * 60 * 60 * 1000);
    await pool.query(
      'INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)',
      [user.id, refreshToken, expiresAt]
    );

    return res.status(200).json({
      user: { id: user.id, username: user.username, email: user.email, role: user.role },
      token,
      refreshToken,
      tokenType: 'Bearer',
      expiresIn: ACCESS_TOKEN_EXPIRY
    });
  } catch (error) {
    return next(error);
  }
});

/* POST /api/auth/refresh */
router.post('/refresh', async (req, res, next) => {
  try {
    const secret = getSecret();
    const { refreshToken: incomingToken } = req.body || {};

    if (!incomingToken) {
      const error = new Error('refreshToken is required');
      error.status = 400;
      return next(error);
    }

    const result = await pool.query(
      'SELECT rt.*, u.role FROM refresh_tokens rt JOIN users u ON rt.user_id = u.id WHERE rt.token = $1 AND rt.expires_at > NOW()',
      [incomingToken]
    );

    if (result.rows.length === 0) {
      const error = new Error('invalid or expired refresh token');
      error.status = 401;
      return next(error);
    }

    const row = result.rows[0];

    await pool.query('DELETE FROM refresh_tokens WHERE id = $1', [row.id]);

    const newRefreshToken = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + REFRESH_TOKEN_EXPIRY_DAYS * 24 * 60 * 60 * 1000);
    await pool.query(
      'INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)',
      [row.user_id, newRefreshToken, expiresAt]
    );

    const token = signAccessToken({ sub: row.user_id.toString(), role: row.role }, secret);

    return res.status(200).json({
      token,
      refreshToken: newRefreshToken,
      tokenType: 'Bearer',
      expiresIn: ACCESS_TOKEN_EXPIRY
    });
  } catch (error) {
    return next(error);
  }
});

/* POST /api/auth/token — legacy demo endpoint for backward compatibility */
router.post('/token', (req, res, next) => {
  try {
    const secret = getSecret();
    const { userId = 'demo-user', role = 'player' } = req.body || {};

    const token = jwt.sign({ sub: userId, role }, secret, {
      expiresIn: '12h',
      issuer: 'nirvana-backend'
    });

    res.status(200).json({ token, tokenType: 'Bearer', expiresIn: '12h' });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
