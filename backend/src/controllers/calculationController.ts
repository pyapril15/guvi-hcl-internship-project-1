// src/controllers/calculationController.ts
import {NextFunction, Request, Response} from 'express';
import {CalculationModel} from '../models/calculationModel';
import {CreateCalculationRequest} from '../types/calculation';
import {logger} from '../utils/logger';

export class CalculationController {
    private calculationModel = new CalculationModel();

    createCalculation = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const calculationData: CreateCalculationRequest = req.body;

            logger.info('Creating new calculation:', calculationData);

            // Verify calculation correctness
            const isValid = this.verifyCalculation(calculationData);
            if (!isValid.valid) {
                res.status(400).json({
                    success: false,
                    message: isValid.error,
                    data: null
                });
                return;
            }

            const calculation = await this.calculationModel.create(calculationData);

            logger.info('Calculation created successfully:', {id: calculation.id});

            res.status(201).json({
                success: true,
                message: 'Calculation created successfully',
                data: calculation,
            });
        } catch (error) {
            logger.error('Error in createCalculation:', error);
            next(error);
        }
    };

    getCalculations = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            logger.info('Fetching all calculations');

            const calculations = await this.calculationModel.findAll();
            const total = await this.calculationModel.count();

            logger.info(`Retrieved ${calculations.length} calculations`);

            res.status(200).json({
                success: true,
                message: 'Calculations retrieved successfully',
                data: calculations,
                meta: {
                    total,
                    count: calculations.length,
                },
            });
        } catch (error) {
            logger.error('Error in getCalculations:', error);
            next(error);
        }
    };

    getCalculationById = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const id = parseInt(req.params.id);

            if (isNaN(id)) {
                res.status(400).json({
                    success: false,
                    message: 'Invalid calculation ID',
                    data: null
                });
                return;
            }

            logger.info('Fetching calculation by ID:', id);

            const calculation = await this.calculationModel.findById(id);

            if (!calculation) {
                res.status(404).json({
                    success: false,
                    message: 'Calculation not found',
                    data: null
                });
                return;
            }

            res.status(200).json({
                success: true,
                message: 'Calculation retrieved successfully',
                data: calculation,
            });
        } catch (error) {
            logger.error('Error in getCalculationById:', error);
            next(error);
        }
    };

    deleteAllCalculations = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            logger.info('Deleting all calculations from database');

            const deletedCount = await this.calculationModel.deleteAll();

            logger.info(`Successfully deleted ${deletedCount} calculations`);

            res.status(200).json({
                success: true,
                message: `Successfully deleted ${deletedCount} calculations`,
                data: {
                    deletedCount: deletedCount
                }
            });
        } catch (error) {
            logger.error('Error in deleteAllCalculations:', error);
            next(error);
        }
    };

    deleteCalculationById = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const id = parseInt(req.params.id);

            if (isNaN(id)) {
                res.status(400).json({
                    success: false,
                    message: 'Invalid calculation ID',
                    data: null
                });
                return;
            }

            logger.info('Deleting calculation by ID:', id);

            const deleted = await this.calculationModel.deleteById(id);

            if (!deleted) {
                res.status(404).json({
                    success: false,
                    message: 'Calculation not found',
                    data: null
                });
                return;
            }

            res.status(200).json({
                success: true,
                message: 'Calculation deleted successfully',
                data: {id}
            });
        } catch (error) {
            logger.error('Error in deleteCalculationById:', error);
            next(error);
        }
    };

    private verifyCalculation(calculation: CreateCalculationRequest): { valid: boolean; error?: string } {
        const {operand1, operator, operand2, result} = calculation;

        // Check for division by zero
        if (operator === '/' && operand2 === 0) {
            return {valid: false, error: 'Division by zero is not allowed'};
        }

        // Calculate expected result
        let expectedResult: number;
        switch (operator) {
            case '+':
                expectedResult = operand1 + operand2;
                break;
            case '-':
                expectedResult = operand1 - operand2;
                break;
            case '*':
                expectedResult = operand1 * operand2;
                break;
            case '/':
                expectedResult = operand1 / operand2;
                break;
            default:
                return {valid: false, error: 'Invalid operator'};
        }

        // Check if result matches (with tolerance for floating-point precision)
        const tolerance = 0.000001;
        if (Math.abs(expectedResult - result) > tolerance) {
            return {
                valid: false,
                error: `Calculation error: ${operand1} ${operator} ${operand2} should equal ${expectedResult}, not ${result}`
            };
        }

        return {valid: true};
    }
}