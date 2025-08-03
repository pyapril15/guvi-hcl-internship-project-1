// src/server.ts
import {createApp} from './app';
import {config} from './config/config';
import {Database} from './config/database';
import {logger} from './utils/logger';
import {runMigrations} from './database/migrate';

async function startServer(): Promise<void> {
    try {
        // Initialize database connection
        const db = Database.getInstance();
        await db.testConnection();

        // Run migrations
        await runMigrations();

        // Create Express app
        const app = createApp();

        // Start server
        const server = app.listen(config.port, () => {
            logger.info(`🚀 Calculator API server running on http://localhost:${config.port}`);
            logger.info(`📊 Health check: http://localhost:${config.port}/api/health`);
            logger.info(`🧮 Calculations API: http://localhost:${config.port}/api/calculations`);
            logger.info(`📝 Environment: ${config.nodeEnv}`);
            logger.info(`🗄️ Database: ${config.db.name}@${config.db.host}:${config.db.port}`);
        });

        // Graceful shutdown
        const gracefulShutdown = async (signal: string) => {
            logger.info(`Received ${signal}. Starting graceful shutdown...`);

            server.close(async () => {
                logger.info('HTTP server closed');

                try {
                    await db.close();
                    logger.info('Database connections closed');
                    process.exit(0);
                } catch (error) {
                    logger.error('Error during shutdown:', error);
                    process.exit(1);
                }
            });

            // Force exit after 10 seconds
            setTimeout(() => {
                logger.error('Forced shutdown after timeout');
                process.exit(1);
            }, 10000);
        };

        process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
        process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    } catch (error) {
        logger.error('Failed to start server:', error);
        process.exit(1);
    }
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
    logger.error('Uncaught Exception:', error);
    process.exit(1);
});

startServer();