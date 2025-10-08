import { createLogger, format, transports } from "winston";
import path from "path";

export const logger = createLogger({
  level: "http",
  format: format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.printf(
      ({ timestamp, level, message }) => `${timestamp} [${level}]: ${message}`
    )
  ),
  transports: [
    new transports.Console(),
    new transports.File({
      filename: path.join("logs", "error.log"),
      level: "error",
    }),
    new transports.File({ filename: path.join("logs", "combined.log") }),
  ],
});

export const logLevels = ['info', 'warn', 'error', 'http'];