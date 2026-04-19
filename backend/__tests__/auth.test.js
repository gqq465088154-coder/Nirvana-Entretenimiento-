const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../src/app');

const TEST_SECRET = 'test-jwt-secret-for-ci';

beforeAll(() => {
  process.env.JWT_SECRET = TEST_SECRET;
});

describe('POST /api/auth/token', () => {
  it('returns 200 with a signed JWT', async () => {
    const res = await request(app)
      .post('/api/auth/token')
      .send({ userId: 'user-1', role: 'player' });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body).toHaveProperty('tokenType', 'Bearer');
    expect(res.body).toHaveProperty('expiresIn', '12h');

    const decoded = jwt.verify(res.body.token, TEST_SECRET);
    expect(decoded).toHaveProperty('sub', 'user-1');
    expect(decoded).toHaveProperty('role', 'player');
    expect(decoded).toHaveProperty('iss', 'nirvana-backend');
  });

  it('uses default userId and role when body is empty', async () => {
    const res = await request(app)
      .post('/api/auth/token')
      .send({});

    expect(res.status).toBe(200);
    const decoded = jwt.verify(res.body.token, TEST_SECRET);
    expect(decoded.sub).toBe('demo-user');
    expect(decoded.role).toBe('player');
  });

  it('returns 500 when JWT_SECRET is missing', async () => {
    const saved = process.env.JWT_SECRET;
    delete process.env.JWT_SECRET;

    const res = await request(app)
      .post('/api/auth/token')
      .send({ userId: 'u1' });

    expect(res.status).toBe(500);
    expect(res.body.error.message).toMatch(/JWT_SECRET/);

    process.env.JWT_SECRET = saved;
  });
});
