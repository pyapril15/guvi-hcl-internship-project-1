// src/app.ts
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import {apiRoutes} from './routes';
import {errorHandler, notFoundHandler} from './middleware/errorHandler';
import {requestLogger} from './middleware/requestLogger';
import {logger} from './utils/logger';

export function createApp(): express.Application {
    const app = express();

    // Security middleware
    app.use(helmet({
        crossOriginEmbedderPolicy: false,
        contentSecurityPolicy: false,
    }));

    // CORS configuration - Allow multiple frontend URLs
    const allowedOrigins = [
        'http://localhost:3000',
        'http://localhost:3001',
        'http://127.0.0.1:3000',
        'http://127.0.0.1:3001',
        process.env.FRONTEND_URL
    ].filter(Boolean);

    app.use(cors({
        origin: (origin, callback) => {
            // Allow requests with no origin (mobile apps, etc.)
            if (!origin) return callback(null, true);

            if (allowedOrigins.includes(origin)) {
                return callback(null, true);
            }

            // Log unauthorized CORS requests
            logger.warn(`CORS blocked request from origin: ${origin}`);
            callback(new Error('CORS policy violation'), false);
        },
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
        exposedHeaders: ['Content-Length', 'X-Request-ID'],
    }));

    // Body parsing middleware
    app.use(express.json({limit: '10mb'}));
    app.use(express.urlencoded({extended: true, limit: '10mb'}));

    // Request logging
    app.use(requestLogger);

    // Root endpoint
    app.get('/', (req, res) => {
        res.json({
            success: true,
            message: 'Calculator API is running',
            version: '1.0.0',
            timestamp: new Date().toISOString(),
            endpoints: {
                health: '/api/health',
                calculations: '/api/calculations'
            }
        });
    });

    // API routes
    app.use('/api', apiRoutes);

    // Error handling middleware
    app.use(notFoundHandler);
    app.use(errorHandler);

    return app;
}