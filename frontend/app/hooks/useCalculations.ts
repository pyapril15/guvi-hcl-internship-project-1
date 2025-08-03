// hooks/useCalculations.ts
import {useCallback, useEffect, useState} from 'react';
import {ApiError, calculatorApi} from '../utils/api';
import {CalculationRecord, CreateCalculationRequest} from '../types/calculation';

export const useCalculations = () => {
    const [history, setHistory] = useState<CalculationRecord[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isOnline, setIsOnline] = useState(true);

    // Check if backend is available
    const checkBackendHealth = useCallback(async () => {
        try {
            const isHealthy = await calculatorApi.checkHealth();
            setIsOnline(isHealthy);
            if (!isHealthy) {
                setError('Backend server is not available.');
            }
            return isHealthy;
        } catch {
            setIsOnline(false);
            setError('Backend server is not available.');
            return false;
        }
    }, []);

    // Load calculations from backend
    const loadCalculations = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const calculations = await calculatorApi.getCalculations();
            setHistory(calculations);
            setIsOnline(true);
        } catch (error) {
            console.error('Failed to load calculations:', error);
            const errorMessage = error instanceof ApiError ? error.message : 'Failed to load calculations';
            setError(errorMessage);
            setIsOnline(false);
            setHistory([]); // Clear history on error
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Save calculation to backend
    const saveCalculation = useCallback(async (calculation: Omit<CalculationRecord, 'id' | 'timestamp'>) => {
        const calculationRequest: CreateCalculationRequest = {
            operand1: calculation.operand1,
            operator: calculation.operator as '+' | '-' | '*' | '/',
            operand2: calculation.operand2,
            result: calculation.result,
        };

        try {
            const savedCalculation = await calculatorApi.saveCalculation(calculationRequest);
            setHistory(prev => [savedCalculation, ...prev]);
            setError(null);
            setIsOnline(true);
            return savedCalculation;
        } catch (error) {
            console.error('Failed to save calculation:', error);
            const errorMessage = error instanceof ApiError ? error.message : 'Failed to save calculation';
            setError(errorMessage);
            setIsOnline(false);
            throw error; // Re-throw to allow caller to handle
        }
    }, []);

    // Clear all calculations from database and update local state
    const clearHistory = useCallback(async () => {
        try {
            setError(null);
            const result = await calculatorApi.deleteAllCalculations();
            setHistory([]);
            console.log(`Successfully cleared ${result.deletedCount} calculations from database`);
        } catch (error) {
            console.error('Failed to clear calculations from database:', error);
            const errorMessage = error instanceof ApiError ? error.message : 'Failed to clear calculations';
            setError(errorMessage);
            setIsOnline(false);

            // Still clear local state even if API call fails
            setHistory([]);
            throw error; // Re-throw to allow caller to handle
        }
    }, []);

    // Retry connection and reload data
    const retryConnection = useCallback(async () => {
        const isHealthy = await checkBackendHealth();
        if (isHealthy) {
            await loadCalculations();
        }
    }, [checkBackendHealth, loadCalculations]);

    // Initialize on mount
    useEffect(() => {
        const initialize = async () => {
            const isHealthy = await checkBackendHealth();
            if (isHealthy) {
                await loadCalculations();
            } else {
                setIsLoading(false);
            }
        };

        initialize();
    }, [checkBackendHealth, loadCalculations]);

    return {
        history,
        isLoading,
        error,
        isOnline,
        saveCalculation,
        clearHistory,
        retryConnection,
        refreshHistory: loadCalculations,
    };
};