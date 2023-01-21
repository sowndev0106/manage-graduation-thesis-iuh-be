/**
 * Setup the winston logger.
 *
 * Documentation: https://github.com/winstonjs/winston
 */
import util from "util"
import { createLogger, format, transports } from 'winston';

// Import Functions
const { File, Console } = transports;

const formatCustom = format.printf((data: any) => {
    const { level, message, label, timestamp } = data
    return `${timestamp} ${level}: ${typeof message === 'string' ? message : util.inspect(message, { colors: true })}`;
});

// Init Logger
const logger = createLogger({
    level: 'info',
});

/**
 * For production write to all logs with level `info` and below
 * to `combined.log. Write all logs error (and below) to `error.log`.
 * For development, print to the console.
 */

if (process.env.WRITE_LOG_FILE === 'true') {

    const fileFormat = format.combine(
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        format.json(),
    );
    const errTransport = new File({
        filename: './logs/error.log',
        format: fileFormat,
        level: 'error',
    });
    const infoTransport = new File({
        filename: './logs/combined.log',
        format: fileFormat,
    });
    logger.add(errTransport);
    logger.add(infoTransport);

} else {

    const errorStackFormat = format((info: any) => {
        if (info.stack) {
            // tslint:disable-next-line:no-console
            console.log(info.stack);
            return false;
        }
        return info;
    });
    const consoleTransport = new Console({
        format: format.combine(
            format.colorize(),
            format.simple(),
            format.timestamp({ format: 'HH:mm:ss' }),
            errorStackFormat(),
            formatCustom
        ),
    });
    logger.add(consoleTransport);
}

export default logger;
