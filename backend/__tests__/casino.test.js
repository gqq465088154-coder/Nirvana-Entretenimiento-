const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../src/app');

const TEST_SECRET = 'test-jwt-secret-for-ci';
let token;

beforeAll(() => {
  process.env.JWT_SECRET = TEST_SECRET;
  token = jwt.sign({ sub: 'player-1', role: 'player' }, TEST_SECRET, {
    expiresIn: '1h',
    issuer: 'nirvana-backend'
  });
});

describe('GET /api/casino/games', () => {
  it('returns 401 without auth token', async () => {
    const res = await request(app).get('/api/casino/games');
    expect(res.status).toBe(401);
  });

  it('returns games list with valid token', async () => {
    const res = await request(app)
      .get('/api/casino/games')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('games');
    expect(Array.isArray(res.body.games)).toBe(true);
    expect(res.body.games.length).toBeGreaterThan(0);

    const game = res.body.games[0];
    expect(game).toHaveProperty('id');
    expect(game).toHaveProperty('name');
    expect(game).toHaveProperty('category');
    expect(game).toHaveProperty('rtp');
  });
});

describe('POST /api/casino/session', () => {
  it('returns 401 without auth token', async () => {
    const res = await request(app)
      .post('/api/casino/session')
      .send({ gameId: 'phoenix-slots' });
    expect(res.status).toBe(401);
  });

  it('returns 400 when gameId is missing', async () => {
    const res = await request(app)
      .post('/api/casino/session')
      .set('Authorization', `Bearer ${token}`)
      .send({});

    expect(res.status).toBe(400);
    expect(res.body.error.message).toMatch(/gameId/);
  });

  it('creates a casino session with valid gameId', async () => {
    const res = await request(app)
      .post('/api/casino/session')
      .set('Authorization', `Bearer ${token}`)
      .send({ gameId: 'phoenix-slots' });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('sessionId');
    expect(res.body).toHaveProperty('gameId', 'phoenix-slots');
    expect(res.body).toHaveProperty('player', 'player-1');
    expect(res.body).toHaveProperty('status', 'ready');
  });
});
