// src/middleware/errorHandler.ts
import {NextFunction, Request, Response} from 'express';
import {logger} from '../utils/logger';

export interface AppError extends Error {
    statusCode?: number;
    isOperational?: boolean;
    code?: string;
}

export class CustomError extends Error implements AppError {
    public statusCode: number;
    public isOperational: boolean;
    public code?: string;

    constructor(message: string, statusCode: number = 500, isOperational: boolean = true) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        this.name = this.constructor.name;

        Error.captureStackTrace(this, this.constructor);
    }
}

export const errorHandler = (
    error: AppError,
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    // Log error details
    logger.error('Error occurred:', {
        message: error.message,
        stack: error.stack,
        url: req.url,
        method: req.method,
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        statusCode: error.statusCode,
        code: error.code,
        isOperational: error.isOperational
    });

    // Determine status code
    let statusCode = error.statusCode || 500;
    let message = error.message || 'Internal Server Error';

    // Handle specific error types
    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
        statusCode = 503;
        message = 'Database connection failed';
    } else if (error.code === 'ER_NO_SUCH_TABLE') {
        statusCode = 503;
        message = 'Database table not found';
    } else if (error.code === 'ECONNREFUSED') {
        statusCode = 503;
        message = 'Database connection refused';
    } else if (error.code === 'ER_DUP_ENTRY') {
        statusCode = 409;
        message = 'Duplicate entry';
    } else if (error.name === 'ValidationError') {
        statusCode = 400;
        message = 'Validation failed';
    } else if (error.name === 'CastError') {
        statusCode = 400;
        message = 'Invalid data format';
    }

    // Don't expose internal errors in production
    if (statusCode === 500 && process.env.NODE_ENV === 'production') {
        message = 'Internal Server Error';
    }

    // Send error response
    const errorResponse: any = {
        success: false,
        message,
        timestamp: new Date().toISOString(),
        path: req.url,
        method: req.method
    };

    // Add additional info in development
    if (process.env.NODE_ENV === 'development') {
        errorResponse.stack = error.stack;
        errorResponse.code = error.code;
    }

    res.status(statusCode).json(errorResponse);
};

export const notFoundHandler = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    const message = `Route ${req.method} ${req.originalUrl} not found`;

    logger.warn('Route not found:', {
        method: req.method,
        url: req.originalUrl,
        ip: req.ip,
        userAgent: req.get('User-Agent')
    });

    res.status(404).json({
        success: false,
        message,
        timestamp: new Date().toISOString(),
        availableEndpoints: {
            health: 'GET /api/health',
            calculations: {
                list: 'GET /api/calculations',
                create: 'POST /api/calculations',
                getById: 'GET /api/calculations/:id'
            }
        }
    });
};

// Async error wrapper
export const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};