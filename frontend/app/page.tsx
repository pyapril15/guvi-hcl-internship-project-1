'use client';

import { useState } from 'react';
import Calculator from './components/Calculator';
import HistoryPanel from './components/HistoryPanel';
import ErrorBanner from './components/ErrorBanner';
import { useCalculations } from './hooks/useCalculations';
import { CalculationRecord } from './types/calculation';

export default function Home() {
    const [showHistory, setShowHistory] = useState(false);
    const [calculatorValue, setCalculatorValue] = useState<string>('0');

    const {
        history,
        isLoading,
        error,
        isOnline,
        saveCalculation,
        clearHistory,
        retryConnection
    } = useCalculations();

    const handleCalculate = async (calculation: Omit<CalculationRecord, 'id' | 'timestamp'>) => {
        try {
            await saveCalculation(calculation);
        } catch (error) {
            // Error is already handled in the hook and displayed in ErrorBanner
            console.error('Calculation save failed:', error);
        }
    };

    const handleHistoryClick = (record: CalculationRecord) => {
        setCalculatorValue(record.result.toString());
    };

    const toggleHistory = () => {
        setShowHistory(!showHistory);
    };

    const handleClearHistory = async () => {
        try {
            await clearHistory();
            console.log('History cleared successfully');
        } catch (error) {
            console.error('Failed to clear history:', error);
            // Error is already handled in the hook and displayed in ErrorBanner
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            <div className="container mx-auto px-4 py-8 max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Calculator</h1>
                    <p className="text-gray-600">Simple calculator with history logs</p>

                    {/* Connection Status */}
                    <div className="flex items-center justify-center mt-2">
                        <div className={`w-2 h-2 rounded-full mr-2 ${isOnline ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        <span className={`text-xs ${isOnline ? 'text-green-600' : 'text-red-600'}`}>
                            {isOnline ? 'Connected to backend' : 'Backend unavailable'}
                        </span>
                    </div>
                </div>

                {/* Error Banner */}
                {error && (
                    <ErrorBanner
                        error={error}
                        isOnline={isOnline}
                        onRetry={retryConnection}
                    />
                )}

                <div className="space-y-6">
                    <Calculator
                        onCalculate={handleCalculate}
                        initialValue={calculatorValue}
                        onToggleHistory={toggleHistory}
                        showHistory={showHistory}
                        isLoading={isLoading}
                    />

                    {showHistory && (
                        <HistoryPanel
                            history={history}
                            onClearHistory={handleClearHistory}
                            onHistoryClick={handleHistoryClick}
                            isLoading={isLoading}
                        />
                    )}
                </div>

                {/* Footer */}
                <div className="text-center mt-8 text-xs text-gray-500">
                    {!isLoading && history.length > 0 && (
                        <p>Total calculations: {history.length}</p>
                    )}
                    <p className="mt-1">
                        {isOnline ? 'All data is synced with server' : 'Waiting for server connection...'}
                    </p>
                </div>
            </div>
        </div>
    );
}