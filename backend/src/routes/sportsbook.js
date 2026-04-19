const express = require('express');

const router = express.Router();

router.get('/events', (_req, res) => {
  res.status(200).json({
    events: [
      {
        id: 'wc2026-arg-bra',
        league: 'FIFA World Cup 2026',
        home: 'Argentina',
        away: 'Brazil',
        odds: { home: 2.3, draw: 3.1, away: 2.8 }
      },
      {
        id: 'wc2026-esp-eng',
        league: 'FIFA World Cup 2026',
        home: 'Spain',
        away: 'England',
        odds: { home: 2.6, draw: 3.0, away: 2.5 }
      }
    ]
  });
});

router.post('/bets', (req, res, next) => {
  const { eventId, market, stake } = req.body || {};
  if (!eventId || !market || typeof stake !== 'number' || stake <= 0) {
    const error = new Error('eventId, market and positive numeric stake are required');
    error.status = 400;
    return next(error);
  }

  return res.status(201).json({
    betId: `bet_${Date.now()}`,
    eventId,
    market,
    stake,
    status: 'accepted',
    placedBy: req.user?.sub || 'unknown'
  });
});

module.exports = router;
