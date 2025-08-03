// src/models/calculationModel.ts
import {Database} from '../config/database';
import {Calculation, CreateCalculationRequest} from '../types/calculation';
import {logger} from '../utils/logger';
import mysql from 'mysql2/promise';

export class CalculationModel {
    private db = Database.getInstance();

    async create(calculationData: CreateCalculationRequest): Promise<Calculation> {
        const connection = await this.db.getPool().getConnection();

        try {
            const query = `
                INSERT INTO calculations (operand1, operator, operand2, result, timestamp)
                VALUES (?, ?, ?, ?, NOW())
            `;

            const [result] = await connection.execute(query, [
                calculationData.operand1,
                calculationData.operator,
                calculationData.operand2,
                calculationData.result,
            ]);

            const insertResult = result as mysql.ResultSetHeader;
            const insertId = insertResult.insertId;

            if (!insertId) {
                throw new Error('Failed to insert calculation - no ID returned');
            }

            logger.info(`Calculation created with ID: ${insertId}`);

            // Fetch the created record
            const [rows] = await connection.execute(
                'SELECT * FROM calculations WHERE id = ?',
                [insertId]
            );

            const calculations = rows as Calculation[];

            if (calculations.length === 0) {
                throw new Error('Failed to retrieve created calculation');
            }

            return calculations[0];
        } catch (error) {
            logger.error('Error creating calculation:', error);
            throw new Error(`Failed to create calculation: ${error instanceof Error ? error.message : 'Unknown error'}`);
        } finally {
            connection.release();
        }
    }

    async findAll(): Promise<Calculation[]> {
        const connection = await this.db.getPool().getConnection();

        try {
            const query = `
                SELECT id, operand1, operator, operand2, result, timestamp
                FROM calculations
                ORDER BY timestamp DESC
                    LIMIT 1000
            `;

            const [rows] = await connection.execute(query);
            const calculations = rows as Calculation[];

            logger.info(`Retrieved ${calculations.length} calculations`);
            return calculations;
        } catch (error) {
            logger.error('Error fetching calculations:', error);
            throw new Error(`Failed to fetch calculations: ${error instanceof Error ? error.message : 'Unknown error'}`);
        } finally {
            connection.release();
        }
    }

    async findById(id: number): Promise<Calculation | null> {
        const connection = await this.db.getPool().getConnection();

        try {
            const query = `
                SELECT id, operand1, operator, operand2, result, timestamp
                FROM calculations
                WHERE id = ?
            `;

            const [rows] = await connection.execute(query, [id]);
            const calculations = rows as Calculation[];

            if (calculations.length === 0) {
                logger.info(`Calculation with ID ${id} not found`);
                return null;
            }

            logger.info(`Retrieved calculation with ID: ${id}`);
            return calculations[0];
        } catch (error) {
            logger.error('Error fetching calculation by ID:', error);
            throw new Error(`Failed to fetch calculation: ${error instanceof Error ? error.message : 'Unknown error'}`);
        } finally {
            connection.release();
        }
    }

    async count(): Promise<number> {
        const connection = await this.db.getPool().getConnection();

        try {
            const [rows] = await connection.execute(
                'SELECT COUNT(*) as count FROM calculations'
            );
            const result = rows as [{ count: number }];
            return result[0].count;
        } catch (error) {
            logger.error('Error counting calculations:', error);
            throw new Error(`Failed to count calculations: ${error instanceof Error ? error.message : 'Unknown error'}`);
        } finally {
            connection.release();
        }
    }

    async deleteAll(): Promise<number> {
        const connection = await this.db.getPool().getConnection();

        try {
            const [result] = await connection.execute('DELETE FROM calculations');
            const deleteResult = result as mysql.ResultSetHeader;

            const deletedCount = deleteResult.affectedRows || 0;
            logger.info(`Deleted ${deletedCount} calculations from database`);
            return deletedCount;
        } catch (error) {
            logger.error('Error deleting all calculations:', error);
            throw new Error(`Failed to delete calculations: ${error instanceof Error ? error.message : 'Unknown error'}`);
        } finally {
            connection.release();
        }
    }

    async deleteById(id: number): Promise<boolean> {
        const connection = await this.db.getPool().getConnection();

        try {
            const [result] = await connection.execute('DELETE FROM calculations WHERE id = ?', [id]);
            const deleteResult = result as mysql.ResultSetHeader;

            const deletedCount = deleteResult.affectedRows || 0;
            if (deletedCount > 0) {
                logger.info(`Deleted calculation with ID: ${id}`);
                return true;
            } else {
                logger.info(`No calculation found with ID: ${id}`);
                return false;
            }
        } catch (error) {
            logger.error('Error deleting calculation by ID:', error);
            throw new Error(`Failed to delete calculation: ${error instanceof Error ? error.message : 'Unknown error'}`);
        } finally {
            connection.release();
        }
    }

    async findRecent(limit: number = 10): Promise<Calculation[]> {
        const connection = await this.db.getPool().getConnection();

        try {
            const query = `
                SELECT id, operand1, operator, operand2, result, timestamp
                FROM calculations
                ORDER BY timestamp DESC
                    LIMIT ?
            `;

            const [rows] = await connection.execute(query, [limit]);
            const calculations = rows as Calculation[];

            logger.info(`Retrieved ${calculations.length} recent calculations`);
            return calculations;
        } catch (error) {
            logger.error('Error fetching recent calculations:', error);
            throw new Error(`Failed to fetch recent calculations: ${error instanceof Error ? error.message : 'Unknown error'}`);
        } finally {
            connection.release();
        }
    }
}