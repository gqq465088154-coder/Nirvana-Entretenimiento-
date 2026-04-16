const express = require('express');

const app = express();
const port = process.env.PORT || 4000;

app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'nirvana-backend',
    timestamp: new Date().toISOString()
  });
});

// TODO(next): Integrate JWT authentication middleware and token issuing routes.
// TODO(next): Add region-aware currency endpoints for ARS/CLP/USD/BRL pricing.

app.listen(port, () => {
  console.log(`Nirvana backend listening on http://localhost:${port}`);
});
