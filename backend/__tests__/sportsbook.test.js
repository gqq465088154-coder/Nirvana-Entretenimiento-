const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../src/app');

const TEST_SECRET = 'test-jwt-secret-for-ci';
let token;

beforeAll(() => {
  process.env.JWT_SECRET = TEST_SECRET;
  token = jwt.sign({ sub: 'tester', role: 'player' }, TEST_SECRET, {
    expiresIn: '1h',
    issuer: 'nirvana-backend'
  });
});

describe('GET /api/sportsbook/events', () => {
  it('returns 401 without auth token', async () => {
    const res = await request(app).get('/api/sportsbook/events');
    expect(res.status).toBe(401);
  });

  it('returns events list with valid token', async () => {
    const res = await request(app)
      .get('/api/sportsbook/events')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('events');
    expect(Array.isArray(res.body.events)).toBe(true);
    expect(res.body.events.length).toBeGreaterThan(0);

    const event = res.body.events[0];
    expect(event).toHaveProperty('id');
    expect(event).toHaveProperty('league');
    expect(event).toHaveProperty('home');
    expect(event).toHaveProperty('away');
    expect(event).toHaveProperty('odds');
  });
});

describe('POST /api/sportsbook/bets', () => {
  it('returns 401 without auth token', async () => {
    const res = await request(app)
      .post('/api/sportsbook/bets')
      .send({ eventId: 'e1', market: 'home', stake: 10 });
    expect(res.status).toBe(401);
  });

  it('returns 400 for invalid bet payload', async () => {
    const res = await request(app)
      .post('/api/sportsbook/bets')
      .set('Authorization', `Bearer ${token}`)
      .send({ eventId: 'e1' });

    expect(res.status).toBe(400);
  });

  it('returns 400 for non-positive stake', async () => {
    const res = await request(app)
      .post('/api/sportsbook/bets')
      .set('Authorization', `Bearer ${token}`)
      .send({ eventId: 'e1', market: 'home', stake: -5 });

    expect(res.status).toBe(400);
  });

  it('accepts a valid bet', async () => {
    const res = await request(app)
      .post('/api/sportsbook/bets')
      .set('Authorization', `Bearer ${token}`)
      .send({ eventId: 'wc2026-arg-bra', market: 'home', stake: 50 });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('betId');
    expect(res.body).toHaveProperty('status', 'accepted');
    expect(res.body).toHaveProperty('placedBy', 'tester');
    expect(res.body.eventId).toBe('wc2026-arg-bra');
    expect(res.body.stake).toBe(50);
  });
});
