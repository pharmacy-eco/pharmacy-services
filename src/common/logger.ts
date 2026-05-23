import * as winston from 'winston';
// eslint-disable-next-line @typescript-eslint/no-var-requires
// const DailyRotateFile = require('winston-daily-rotate-file');

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(winston.format.timestamp(), winston.format.simple()),
    transports: [new winston.transports.Console()],
});

export default logger;
