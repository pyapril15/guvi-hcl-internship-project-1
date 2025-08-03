// src/routes/index.ts
import {Request, Response, Router} from 'express';
import {calculationRoutes} from './calculationRoutes';
import {Database} from '../config/database';
import {logger} from '../utils/logger';

const router = Router();

router.get('/health', async (req: Request, res: Response) => {
    const healthCheck = {
        success: true,
        message: 'Server is running',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        version: '1.0.0',
        environment: process.env.NODE_ENV || 'development',
        services: {
            database: false,
            server: true,
        }
    };

    try {
        // Check database health
        const db = Database.getInstance();
        healthCheck.services.database = await db.isHealthy();

        // Overall health status
        const isHealthy = Object.values(healthCheck.services).every(service => service === true);

        if (isHealthy) {
            logger.info('Health check passed');
            res.status(200).json(healthCheck);
        } else {
            logger.warn('Health check failed - some services unavailable');
            res.status(503).json({
                ...healthCheck,
                success: false,
                message: 'Some services are unavailable'
            });
        }
    } catch (error) {
        logger.error('Health check error:', error);
        res.status(503).json({
            ...healthCheck,
            success: false,
            message: 'Health check failed',
            error: process.env.NODE_ENV === 'development' ? error instanceof Error ? error.message : 'Unknown error' : undefined
        });
    }
});

// Simple ping endpoint for basic connectivity tests
router.get('/ping', (req: Request, res: Response) => {
    res.status(200).json({
        success: true,
        message: 'pong',
        timestamp: new Date().toISOString()
    });
});

// API info endpoint
router.get('/info', (req: Request, res: Response) => {
    res.status(200).json({
        success: true,
        name: 'Calculator API',
        version: '1.0.0',
        description: 'REST API for calculator with calculation history',
        endpoints: {
            health: 'GET /api/health',
            ping: 'GET /api/ping',
            calculations: {
                list: 'GET /api/calculations',
                create: 'POST /api/calculations',
                getById: 'GET /api/calculations/:id',
                deleteAll: 'DELETE /api/calculations',
                deleteById: 'DELETE /api/calculations/:id'
            }
        },
        timestamp: new Date().toISOString()
    });
});

// Calculation routes
router.use('/calculations', calculationRoutes);

export {router as apiRoutes};