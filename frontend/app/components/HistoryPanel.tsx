'use client';

import { useState } from 'react';
import { CalculationRecord } from '../types/calculation';

interface HistoryPanelProps {
    history: CalculationRecord[];
    onClearHistory: () => Promise<void>;
    onHistoryClick: (record: CalculationRecord) => void;
    isLoading?: boolean;
}

export default function HistoryPanel({
                                         history,
                                         onClearHistory,
                                         onHistoryClick,
                                         isLoading = false
                                     }: HistoryPanelProps) {
    const [isClearing, setIsClearing] = useState(false);

    const formatDate = (timestamp: string) => {
        try {
            const date = new Date(timestamp);
            return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
        } catch {
            return 'Invalid date';
        }
    };

    const handleClearClick = async () => {
        if (isClearing) return;

        // Show confirmation dialog
        const confirmClear = window.confirm(
            `Are you sure you want to delete all ${history.length} calculations? This action cannot be undone.`
        );

        if (!confirmClear) return;

        try {
            setIsClearing(true);
            await onClearHistory();
        } catch (error) {
            console.error('Clear history failed:', error);
            // Show error message to user
            alert('Failed to clear calculations. Please try again.');
        } finally {
            setIsClearing(false);
        }
    };

    if (isLoading) {
        return (
            <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="ml-2 text-gray-600">Loading history...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <i className="ri-history-line"></i>
                    Calculation History
                </h2>
                {history.length > 0 && (
                    <button
                        onClick={handleClearClick}
                        disabled={isClearing}
                        className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors flex items-center gap-2 ${
                            isClearing
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : 'bg-red-500 hover:bg-red-600 text-white'
                        }`}
                    >
                        {isClearing ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                Clearing...
                            </>
                        ) : (
                            <>
                                <i className="ri-delete-bin-line"></i>
                                Clear All
                            </>
                        )}
                    </button>
                )}
            </div>

            <div className="max-h-96 overflow-y-auto">
                {history.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        <i className="ri-calculator-line text-4xl mb-2"></i>
                        <p>No calculations yet</p>
                        <p className="text-sm">Start calculating to see your history</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {history.map((record) => (
                            <div
                                key={record.id}
                                onClick={() => onHistoryClick(record)}
                                className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:bg-blue-50 hover:border-blue-300 transition-all cursor-pointer group"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <div className="text-lg font-mono text-gray-800 mb-1 group-hover:text-blue-700">
                                            {record.operand1} {record.operator} {record.operand2} = {record.result}
                                        </div>
                                        <div className="text-sm text-gray-500 flex items-center gap-1">
                                            <i className="ri-time-line"></i>
                                            {formatDate(record.timestamp)}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium group-hover:bg-blue-200">
                                            {record.result}
                                        </div>
                                        <i className="ri-arrow-right-line text-gray-400 group-hover:text-blue-500"></i>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {history.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="text-sm text-gray-600 text-center">
                        Total calculations: {history.length}
                    </div>
                    <div className="text-xs text-gray-500 text-center mt-1">
                        Click any calculation to reuse the result
                    </div>
                </div>
            )}
        </div>
    );
}