// src/routes/calculationRoutes.ts
import { Router } from 'express';
import { CalculationController } from '../controllers/calculationController';
import { validateCalculation } from '../middleware/validation';

const router = Router();
const calculationController = new CalculationController();

// GET /calculations - Get all calculations
router.get('/', calculationController.getCalculations);

// GET /calculations/:id - Get calculation by ID
router.get('/:id', calculationController.getCalculationById);

// POST /calculations - Create a new calculation
router.post('/', validateCalculation, calculationController.createCalculation);

// DELETE /calculations - Delete all calculations
router.delete('/', calculationController.deleteAllCalculations);

// DELETE /calculations/:id - Delete calculation by ID
router.delete('/:id', calculationController.deleteCalculationById);

export { router as calculationRoutes };