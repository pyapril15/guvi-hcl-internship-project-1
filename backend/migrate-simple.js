// migrate-simple.js - Simple JavaScript migration to avoid TypeScript issues
const mysql = require('mysql2/promise');
require('dotenv').config();

const createCalculationsTable = `
    CREATE TABLE IF NOT EXISTS calculations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        operand1 DECIMAL(20, 10) NOT NULL,
        operator ENUM('+', '-', '*', '/') NOT NULL,
        operand2 DECIMAL(20, 10) NOT NULL,
        result DECIMAL(20, 10) NOT NULL,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_timestamp (timestamp DESC)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
`;

async function runMigration() {
    let connection;

    try {
        console.log('🚀 Starting database migration...');

        // Create connection
        connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            port: parseInt(process.env.DB_PORT || '3306'),
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'calculator_db'
        });

        console.log('✅ Database connection established');

        // Create calculations table
        await connection.execute(createCalculationsTable);
        console.log('✅ Calculations table created/verified');

        // Verify table structure
        const [columns] = await connection.execute('DESCRIBE calculations');
        console.log('✅ Table structure verified:', columns.length, 'columns');

        // Check if table has data
        const [countResult] = await connection.execute('SELECT COUNT(*) as count FROM calculations');
        const count = countResult[0].count;
        console.log(`✅ Calculations table has ${count} records`);

        console.log('🎉 Database migration completed successfully!');

    } catch (error) {
        console.error('❌ Migration failed:', error.message);

        if (error.code === 'ER_BAD_DB_ERROR') {
            console.log('💡 Database does not exist. Creating it...');
            try {
                const tempConnection = await mysql.createConnection({
                    host: process.env.DB_HOST || 'localhost',
                    port: parseInt(process.env.DB_PORT || '3306'),
                    user: process.env.DB_USER || 'root',
                    password: process.env.DB_PASSWORD || ''
                });

                await tempConnection.execute(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME || 'calculator_db'}`);
                console.log('✅ Database created');
                await tempConnection.end();

                console.log('🔄 Retrying migration...');
                return runMigration();

            } catch (createError) {
                console.error('❌ Failed to create database:', createError.message);
            }
        }

        process.exit(1);
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

// Run migration
runMigration().then(() => {
    console.log('✅ Migration script completed');
    process.exit(0);
}).catch((error) => {
    console.error('❌ Migration script failed:', error);
    process.exit(1);
});