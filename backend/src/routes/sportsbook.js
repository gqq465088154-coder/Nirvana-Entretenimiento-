const crypto = require('crypto');
const express = require('express');

const sportsbookRouter = express.Router();

sportsbookRouter.get('/markets', (_req, res) => {
  res.status(200).json({
    markets: [
      { id: 'match-winner', name: 'Match Winner', odds: [{ team: 'Home', value: 1.82 }, { team: 'Away', value: 2.05 }] },
      { id: 'total-goals', name: 'Total Goals', odds: [{ selection: 'Over 2.5', value: 1.95 }, { selection: 'Under 2.5', value: 1.88 }] }
    ]
  });
});

sportsbookRouter.post('/bets', (req, res) => {
  const { marketId, selection, stake } = req.body;

  if (!marketId || !selection || !Number.isFinite(Number(stake)) || Number(stake) <= 0) {
    return res.status(400).json({ error: 'invalid_bet_payload' });
  }

  return res.status(201).json({
    betId: crypto.randomUUID(),
    marketId,
    selection,
    stake: Number(stake),
    status: 'accepted'
  });
});

module.exports = { sportsbookRouter };
