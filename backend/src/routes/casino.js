const express = require('express');

const router = express.Router();

router.get('/games', (_req, res) => {
  res.status(200).json({
    games: [
      { id: 'phoenix-slots', name: 'Phoenix Stadium Slots', category: 'slots', rtp: 96.2 },
      { id: 'golden-penalty', name: 'Golden Penalty Roulette', category: 'roulette', rtp: 97.1 },
      { id: 'rebirth-blackjack', name: 'Rebirth Blackjack', category: 'table', rtp: 99.0 }
    ]
  });
});

router.post('/session', (req, res, next) => {
  const { gameId } = req.body || {};
  if (!gameId) {
    const error = new Error('gameId is required');
    error.status = 400;
    return next(error);
  }

  return res.status(201).json({
    sessionId: `casino_${Date.now()}`,
    gameId,
    player: req.user?.sub || 'unknown',
    status: 'ready'
  });
});

module.exports = router;
