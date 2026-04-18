const levels = {
  info: 'INFO',
  warn: 'WARN',
  error: 'ERROR'
};

function log(level, message, meta) {
  const entry = {
    level: levels[level] || levels.info,
    timestamp: new Date().toISOString(),
    message,
    ...(meta ? { meta } : {})
  };

  const line = JSON.stringify(entry);
  if (level === 'error') {
    console.error(line);
    return;
  }

  if (level === 'warn') {
    console.warn(line);
    return;
  }

  console.log(line);
}

module.exports = {
  info: (message, meta) => log('info', message, meta),
  warn: (message, meta) => log('warn', message, meta),
  error: (message, meta) => log('error', message, meta)
};
