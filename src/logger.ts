import winston, { format } from "winston";
import { ProcessLogger } from "./interfaces";
import { isDev } from "./env";
import DailyRotateFile from "winston-daily-rotate-file";

export type LoggerOptions = {
  dirname: string;
  level?: string;
};

export const createLogger = ({ dirname, level }: LoggerOptions) => {
  var transport = new DailyRotateFile({
    dirname,
    filename: "checkup.log",
    datePattern: "YYYY",
    zippedArchive: true,
    maxSize: isDev ? "5k" : "5m",
    maxFiles: 3,
  });
  const winstonLogger = winston.createLogger({
    level: level || (isDev ? "verbose" : "info"),
    format: format.combine(
      format.timestamp({
        format: "YYYY-MM-DD HH:mm:ss",
      }),
      winston.format.simple()
    ),
    // defaultMeta: { service: 'user-service' },
    transports: [
      isDev ? new winston.transports.Console() : (null as any),
      // new winston.transports.File({ filename: 'error.log', level: 'error' }),
      transport,
    ].filter((i) => !!i),
  });
  const logger: ProcessLogger = ({ level, message, tags, processName }) => {
    const meta: any = { processName };
    if (tags && tags.length) meta.tags = tags;
    winstonLogger.log(level, message, meta);
  };
  return logger;
};
