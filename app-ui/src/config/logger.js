import { createLogger, format, transports } from 'winston/browser';

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.printf(
      ({ timestamp, level, message }) => `${timestamp} [${level}]: ${message}`
    )
  ),
  transports: [new transports.Console()],
});

// Example
logger.info('Frontend logger initialized');
logger.warn('API response took too long');
logger.error('Something broke on the client side');

export default logger;
