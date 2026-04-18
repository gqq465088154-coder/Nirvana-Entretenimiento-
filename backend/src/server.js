const app = require('./app');
const logger = require('./utils/logger');

const port = Number(process.env.PORT || 4000);

app.listen(port, () => {
  logger.info(`Nirvana backend listening on http://localhost:${port}`);
});
