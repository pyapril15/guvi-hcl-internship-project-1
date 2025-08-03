// src/config/database.ts
import mysql from 'mysql2/promise';
import {config} from './config';
import {logger} from '../utils/logger';

export class Database {
    private static instance: Database;
    private readonly pool: mysql.Pool;

    private constructor() {
        this.pool = mysql.createPool({
            host: config.db.host,
            port: config.db.port,
            user: config.db.user,
            password: config.db.password,
            database: config.db.name,
            waitForConnections: true,
            connectionLimit: config.db.connectionLimit,
            queueLimit: 0,
        });

        // Handle pool events
        this.pool.on('connection', () => {
            logger.info(`New database connection established`);
        });
    }

    public static getInstance(): Database {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    }

    public getPool(): mysql.Pool {
        return this.pool;
    }

    public async testConnection(): Promise<void> {
        let connection: mysql.PoolConnection | undefined;
        try {
            connection = await this.pool.getConnection();
            await connection.ping();
            logger.info('Database connection test successful');

            // Test a simple query
            const [rows] = await connection.execute('SELECT 1 as test');
            logger.info('Database query test successful');

            logger.info('Database connection established successfully');
        } catch (error) {
            logger.error('Failed to connect to database:', error);
            throw new Error(`Database connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        } finally {
            if (connection) {
                connection.release();
            }
        }
    }

    public async executeQuery<T = any>(query: string, params: any[] = []): Promise<[T[], mysql.FieldPacket[]]> {
        let connection: mysql.PoolConnection | undefined;
        try {
            connection = await this.pool.getConnection();
            const result = await connection.execute(query, params);
            return result as [T[], mysql.FieldPacket[]];
        } finally {
            if (connection) {
                connection.release();
            }
        }
    }

    public async close(): Promise<void> {
        try {
            await this.pool.end();
            logger.info('Database connection pool closed successfully');
        } catch (error) {
            logger.error('Error closing database connection pool:', error);
            throw error;
        }
    }

    // Health check method
    public async isHealthy(): Promise<boolean> {
        let connection: mysql.PoolConnection | undefined;
        try {
            connection = await this.pool.getConnection();
            await connection.ping();
            return true;
        } catch (error) {
            logger.error('Database health check failed:', error);
            return false;
        } finally {
            if (connection) {
                connection.release();
            }
        }
    }
}