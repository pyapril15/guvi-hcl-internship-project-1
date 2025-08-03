// src/middleware/validation.ts
import {NextFunction, Request, Response} from 'express';
import Joi from 'joi';
import {logger} from '../utils/logger';

const calculationSchema = Joi.object({
    operand1: Joi.number().required().messages({
        'number.base': 'Operand1 must be a number',
        'any.required': 'Operand1 is required',
    }),
    operator: Joi.string().valid('+', '-', '*', '/').required().messages({
        'any.only': 'Operator must be one of: +, -, *, /',
        'any.required': 'Operator is required',
    }),
    operand2: Joi.number().required().messages({
        'number.base': 'Operand2 must be a number',
        'any.required': 'Operand2 is required',
    }),
    result: Joi.number().required().messages({
        'number.base': 'Result must be a number',
        'any.required': 'Result is required',
    }),
});

export const validateCalculation = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    const {error, value} = calculationSchema.validate(req.body);

    if (error) {
        logger.warn('Validation error:', error.details);
        res.status(400).json({
            success: false,
            message: 'Validation error',
            errors: error.details.map((detail) => ({
                field: detail.path.join('.'),
                message: detail.message,
            })),
        });
        return;
    }

    req.body = value;
    next();
};