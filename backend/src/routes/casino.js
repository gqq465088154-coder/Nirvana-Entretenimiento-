const crypto = require('crypto');
const express = require('express');

const casinoRouter = express.Router();

const games = [
  { id: 'phoenix-spin', name: 'Phoenix Spin', minWager: 1 },
  { id: 'ember-roulette', name: 'Ember Roulette', minWager: 5 },
  { id: 'nightjack', name: 'Nightjack', minWager: 2 }
];

casinoRouter.get('/games', (_req, res) => {
  res.status(200).json({ games });
});

casinoRouter.post('/spin', (req, res) => {
  const { gameId, wager } = req.body;
  const game = games.find((item) => item.id === gameId);

  if (!game || Number(wager) < game.minWager) {
    return res.status(400).json({ error: 'invalid_game_or_wager' });
  }

  const multiplier = Math.random() < 0.35 ? Number((1 + Math.random() * 2.5).toFixed(2)) : 0;
  const payout = Number((Number(wager) * multiplier).toFixed(2));

  return res.status(200).json({
    spinId: crypto.randomUUID(),
    gameId,
    wager: Number(wager),
    multiplier,
    payout,
    result: payout > 0 ? 'win' : 'lose'
  });
});

module.exports = { casinoRouter };
