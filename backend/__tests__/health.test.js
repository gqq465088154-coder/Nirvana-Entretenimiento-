const request = require('supertest');
const app = require('../src/app');

describe('GET /api/health', () => {
  it('returns 200 with status ok when DB and Redis are not configured', async () => {
    const res = await request(app).get('/api/health');

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('status', 'ok');
    expect(res.body).toHaveProperty('service', 'nirvana-backend');
    expect(res.body).toHaveProperty('timestamp');
    expect(res.body).toHaveProperty('checks');
  });

  it('returns valid ISO timestamp', async () => {
    const res = await request(app).get('/api/health');

    const parsed = new Date(res.body.timestamp);
    expect(parsed.toISOString()).toBe(res.body.timestamp);
  });

  it('reports postgres and redis check results', async () => {
    const res = await request(app).get('/api/health');

    expect(res.body.checks).toHaveProperty('postgres');
    expect(res.body.checks).toHaveProperty('redis');
  });
});
