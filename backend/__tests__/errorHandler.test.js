const request = require('supertest');
const app = require('../src/app');

beforeAll(() => {
  process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-jwt-secret-for-ci';
});

describe('Error handling', () => {
  it('returns 404 JSON for unknown routes', async () => {
    const res = await request(app).get('/api/nonexistent');

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error');
    expect(res.body.error).toHaveProperty('message');
    expect(res.body.error).toHaveProperty('status', 404);
  });

  it('returns 401 for invalid token on protected route', async () => {
    const res = await request(app)
      .get('/api/sportsbook/events')
      .set('Authorization', 'Bearer invalid.token.here');

    expect(res.status).toBe(401);
  });
});
