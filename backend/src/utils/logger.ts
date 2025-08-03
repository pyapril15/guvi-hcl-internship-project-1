// src/utils/logger.ts

// Simple logger implementation
const createSimpleLogger = () => {
    const formatMessage = (level: string, message: string, meta?: any) => {
        const timestamp = new Date().toISOString();
        let logMessage = `${timestamp} [${level.toUpperCase()}]: ${message}`;

        if (meta && Object.keys(meta).length > 0) {
            logMessage += ` ${JSON.stringify(meta)}`;
        }

        return logMessage;
    };

    return {
        info: (message: string, meta?: any) => {
            console.log(formatMessage('info', message, meta));
        },

        warn: (message: string, meta?: any) => {
            console.warn(formatMessage('warn', message, meta));
        },

        error: (message: string, meta?: any) => {
            console.error(formatMessage('error', message, meta));
        },

        debug: (message: string, meta?: any) => {
            if (process.env.NODE_ENV === 'development') {
                console.log(formatMessage('debug', message, meta));
            }
        }
    };
};

let logger: any;

try {
    // import winston
    const winston = require('winston');

    // Create logs directory if it doesn't exist
    const fs = require('fs');
    const path = require('path');

    const logsDir = path.join(process.cwd(), 'logs');
    if (!fs.existsSync(logsDir)) {
        fs.mkdirSync(logsDir, { recursive: true });
    }

    const logFormat = winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.errors({ stack: true }),
        winston.format.colorize({ all: true }),
        winston.format.printf(({ timestamp, level, message, stack, ...meta }: any) => {
            let logMessage = `${timestamp} [${level}]: ${message}`;

            // Add metadata if present
            if (Object.keys(meta).length > 0) {
                logMessage += ` ${JSON.stringify(meta)}`;
            }

            // Add stack trace for errors
            if (stack) {
                logMessage += `\n${stack}`;
            }

            return logMessage;
        })
    );

    logger = winston.createLogger({
        level: process.env.LOG_LEVEL || 'info',
        format: logFormat,
        transports: [
            // Console transport
            new winston.transports.Console({
                format: logFormat
            }),

            // File transport for errors
            new winston.transports.File({
                filename: 'logs/error.log',
                level: 'error',
                format: winston.format.combine(
                    winston.format.timestamp(),
                    winston.format.json()
                )
            }),

            // File transport for all logs
            new winston.transports.File({
                filename: 'logs/combined.log',
                format: winston.format.combine(
                    winston.format.timestamp(),
                    winston.format.json()
                )
            })
        ]
    });

    // also log to the console with colors
    if (process.env.NODE_ENV !== 'production') {
        logger.add(new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            )
        }));
    }

} catch (error) {
    // Winston not available, use simple logger
    logger = createSimpleLogger();
    console.warn('Winston not found, using simple console logger');
}

export { logger };