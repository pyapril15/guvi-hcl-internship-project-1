// src/database/migrate.ts
import {Database} from '../config/database';
import {logger} from '../utils/logger';

const createCalculationsTable = `
    CREATE TABLE IF NOT EXISTS calculations
    (
        id
        INT
        AUTO_INCREMENT
        PRIMARY
        KEY,
        operand1
        DECIMAL
    (
        20,
        10
    ) NOT NULL,
        operator ENUM
    (
        '+',
        '-',
        '*',
        '/'
    ) NOT NULL,
        operand2 DECIMAL
    (
        20,
        10
    ) NOT NULL,
        result DECIMAL
    (
        20,
        10
    ) NOT NULL,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_timestamp
    (
        timestamp
        DESC
    ),
        INDEX idx_operator
    (
        operator
    ),
        INDEX idx_result
    (
        result
    )
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE =utf8mb4_unicode_ci;
`;

const createIndexes = [
    'CREATE INDEX IF NOT EXISTS idx_calculations_timestamp_desc ON calculations (timestamp DESC);',
    'CREATE INDEX IF NOT EXISTS idx_calculations_operator ON calculations (operator);',
    'CREATE INDEX IF NOT EXISTS idx_calculations_result ON calculations (result);'
];

export async function runMigrations(): Promise<void> {
    const db = Database.getInstance();
    const connection = await db.getPool().getConnection();

    try {
        logger.info('Starting database migrations...');

        // Create calculations table
        await connection.execute(createCalculationsTable);
        logger.info('✅ Calculations table created/verified');

        // Create indexes (if not exists)
        for (const indexQuery of createIndexes) {
            try {
                await connection.execute(indexQuery);
            } catch (error) {
                // Ignore errors for existing indexes
                if (error instanceof Error && !error.message.includes('Duplicate key name')) {
                    logger.warn('Index creation warning:', error.message);
                }
            }
        }
        logger.info('✅ Database indexes created/verified');

        // Verify table structure
        const [columns] = await connection.execute('DESCRIBE calculations');
        logger.info('✅ Table structure verified:', columns);

        // Check if table has data
        const [countResult] = await connection.execute('SELECT COUNT(*) as count FROM calculations');
        const count = (countResult as any)[0].count;
        logger.info(`✅ Calculations table has ${count} records`);

        logger.info('✅ Database migrations completed successfully');
    } catch (error) {
        logger.error('❌ Migration failed:', error);
        throw new Error(`Migration failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
        connection.release();
    }
}

// Helper function to drop all tables (for development/testing)
export async function dropAllTables(): Promise<void> {
    const db = Database.getInstance();
    const connection = await db.getPool().getConnection();

    try {
        logger.warn('Dropping all tables...');

        await connection.execute('SET FOREIGN_KEY_CHECKS = 0');
        await connection.execute('DROP TABLE IF EXISTS calculations');
        await connection.execute('SET FOREIGN_KEY_CHECKS = 1');

        logger.warn('All tables dropped');
    } catch (error) {
        logger.error('Error dropping tables:', error);
        throw error;
    } finally {
        connection.release();
    }
}

// Run migrations if this file is executed directly
if (require.main === module) {
    runMigrations()
        .then(() => {
            logger.info('✅ Migrations completed successfully');
            process.exit(0);
        })
        .catch((error) => {
            logger.error('❌ Migration failed:', error);
            process.exit(1);
        });
}