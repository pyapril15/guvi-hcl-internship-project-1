// src/config/config.ts
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file
dotenv.config({path: path.resolve(process.cwd(), '.env')});

export const config = {
    port: parseInt(process.env.PORT || '3006', 10),
    nodeEnv: process.env.NODE_ENV || 'development',

    db: {
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '3306', 10),
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        name: process.env.DB_NAME || 'calculator_db',
        connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT || '10', 10),
        timeout: parseInt(process.env.DB_TIMEOUT || '60000', 10),
    },

    cors: {
        allowedOrigins: [
            'http://localhost:3000',
            'http://localhost:3001',
            'http://127.0.0.1:3000',
            'http://127.0.0.1:3001',
            process.env.FRONTEND_URL
        ].filter(Boolean),
    },

    logging: {
        level: process.env.LOG_LEVEL || 'info',
        format: process.env.LOG_FORMAT || 'combined',
    },
} as const;

// Validate required environment variables
const requiredEnvVars = ['DB_PASSWORD'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
    console.error('Missing required environment variables:', missingEnvVars);
    console.error('Please create a .env file with the required variables');
    process.exit(1);
}

// Log configuration (only in development)
if (config.nodeEnv === 'development') {
    console.log('Configuration loaded:', {
        port: config.port,
        nodeEnv: config.nodeEnv,
        database: `${config.db.user}@${config.db.host}:${config.db.port}/${config.db.name}`,
        corsOrigins: config.cors.allowedOrigins,
    });
}