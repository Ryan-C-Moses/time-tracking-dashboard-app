import { getToken } from '../services/token-store';

const baseLogger = (level, msg, component, ctx = null) => {
  const evt = { level, msg, component, tsFromFE: Date.now(), ...ctx};

  const headers = { 'Content-Type': 'application/json' };
  if (getToken()) headers['Authorization'] = `Bearer ${getToken()}`;

  fetch('/api/logs', {
    method: 'POST',
    headers,
    body: JSON.stringify(evt),
  });
};

const log = {
  info: (m, c, ctx) => baseLogger('info', m, c, ctx),
  warn: (m, c, ctx) => baseLogger('warn', m, c, ctx),
  error: (m, c, ctx) => baseLogger('error', m, c, ctx),
  http: (m, c, ctx) => baseLogger('http', m, c, ctx),
};

export default log;
