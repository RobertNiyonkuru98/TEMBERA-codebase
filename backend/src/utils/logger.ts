import { createLogger, format, transports } from "winston";
import type { TransformableInfo } from "logform";
import { LOG_LEVEL } from "./constants";
import { serializeBigInt } from "./serialize";


const { combine, timestamp, printf, colorize, errors } = format;

const cleanStackTrace = format((info: TransformableInfo) => {
  if (typeof info.stack !== "string") {
    return info;
  }

  const cleanedStack = info.stack
    .split("\n")
    .filter((line) => line.includes("/src/"))
    .map((line) => {
      const idx = line.indexOf("/src/");
      return idx !== -1 ? line.slice(idx + 1) : line;
    })
    .join("\n");

  info.stack = cleanedStack;
  return info;
});

const logFormat = printf((info: TransformableInfo) => {
  const metaData = { ...info, level: undefined, timestamp: undefined, message: undefined };
  return `${info.timestamp} [${info.level}]: ${info.message} ${
    Object.keys(info).length > 2 ? JSON.stringify(serializeBigInt(metaData)) : ""
  }`;
});

export const logger = createLogger({
  level: LOG_LEVEL || "info",
  format: combine(
    colorize(),
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    errors({ stack: true }),
    cleanStackTrace(),
    logFormat,
  ),
  transports: [
        new transports.Console(),
        new transports.File({ filename: "logs/error.log", level: "error" }),
        new transports.File({ filename: "logs/combined.log" }),
      ],
  exitOnError: false,
});