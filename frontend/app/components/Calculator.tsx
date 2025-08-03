'use client';

import React, {useState} from 'react';
import {CalculationRecord} from "@/app/types/calculation";

interface CalculatorProps {
    onCalculate: (calculation: Omit<CalculationRecord, 'id' | 'timestamp'>) => void;
    initialValue?: string;
    onToggleHistory: () => void;
    showHistory: boolean;
}

export default function Calculator({onCalculate, initialValue, onToggleHistory, showHistory}: CalculatorProps) {
    const [display, setDisplay] = useState(initialValue || '0');
    const [previousValue, setPreviousValue] = useState<number | null>(null);
    const [operation, setOperation] = useState<string | null>(null);
    const [waitingForOperand, setWaitingForOperand] = useState(false);
    const [expression, setExpression] = useState('');

    React.useEffect(() => {
        if (initialValue && initialValue !== display) {
            setDisplay(initialValue);
            setPreviousValue(null);
            setOperation(null);
            setWaitingForOperand(false);
            setExpression('');
        }
    }, [initialValue]);

    const inputNumber = (num: string) => {
        if (waitingForOperand) {
            setDisplay(num);
            setWaitingForOperand(false);
        } else {
            setDisplay(display === '0' ? num : display + num);
        }
    };

    const inputDecimal = () => {
        if (waitingForOperand) {
            setDisplay('0.');
            setWaitingForOperand(false);
        } else if (display.indexOf('.') === -1) {
            setDisplay(display + '.');
        }
    };

    const backspace = () => {
        if (display.length > 1) {
            setDisplay(display.slice(0, -1));
        } else {
            setDisplay('0');
        }
    };

    const clear = () => {
        setDisplay('0');
        setPreviousValue(null);
        setOperation(null);
        setWaitingForOperand(false);
        setExpression('');
    };

    const performOperation = (nextOperation: string) => {
        const inputValue = parseFloat(display);

        if (previousValue === null) {
            setPreviousValue(inputValue);
            setExpression(`${inputValue} ${nextOperation}`);
        } else if (operation) {
            const currentValue = previousValue || 0;
            const result = calculate(currentValue, inputValue, operation);

            setDisplay(String(result));
            setPreviousValue(result);
            setExpression(`${result} ${nextOperation}`);

            onCalculate({
                operand1: currentValue,
                operator: operation,
                operand2: inputValue,
                result: result
            });
        }

        setWaitingForOperand(true);
        setOperation(nextOperation);
    };

    const calculate = (firstOperand: number, secondOperand: number, operation: string): number => {
        switch (operation) {
            case '+':
                return firstOperand + secondOperand;
            case '-':
                return firstOperand - secondOperand;
            case '×':
                return firstOperand * secondOperand;
            case '÷':
                return secondOperand !== 0 ? firstOperand / secondOperand : 0;
            default:
                return secondOperand;
        }
    };

    const handleEquals = () => {
        if (operation && previousValue !== null) {
            const inputValue = parseFloat(display);
            const result = calculate(previousValue, inputValue, operation);

            setDisplay(String(result));
            setExpression(`${previousValue} ${operation} ${inputValue} = ${result}`);

            onCalculate({
                operand1: previousValue,
                operator: operation,
                operand2: inputValue,
                result: result
            });

            setOperation(null);
            setPreviousValue(null);
            setWaitingForOperand(true);
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-lg p-6">
            {/* Display */}
            <div className="bg-gray-900 text-white rounded-lg mb-6 p-4">
                {/* Expression display */}
                <div className="text-sm text-gray-400 mb-2 h-6">
                    {expression}
                </div>
                {/* Main display */}
                <div className="text-right text-3xl font-mono min-h-[50px] flex items-center justify-end">
                    {display}
                </div>
            </div>

            {/* History Button */}
            <div className="flex justify-center mb-4">
                <button
                    onClick={onToggleHistory}
                    className="!rounded-button bg-indigo-600 text-white px-6 py-3 font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2"
                >
                    <i className="ri-history-line"></i>
                    {showHistory ? 'Hide History' : 'Show History'}
                </button>
            </div>

            {/* Buttons */}
            <div className="grid grid-cols-4 gap-3">
                {/* First Row */}
                <button
                    onClick={clear}
                    className="!rounded-button bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-4 transition-colors"
                >
                    AC
                </button>
                <button
                    onClick={backspace}
                    className="!rounded-button bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-4 transition-colors flex items-center justify-center"
                >
                    <i className="ri-arrow-left-line text-lg"></i>
                </button>
                <button
                    onClick={() => performOperation('÷')}
                    className="!rounded-button bg-orange-500 hover:bg-orange-600 text-white font-semibold py-4 transition-colors"
                >
                    ÷
                </button>
                <button
                    onClick={() => performOperation('×')}
                    className="!rounded-button bg-orange-500 hover:bg-orange-600 text-white font-semibold py-4 transition-colors"
                >
                    ×
                </button>

                {/* Second Row */}
                <button
                    onClick={() => inputNumber('7')}
                    className="!rounded-button bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-4 transition-colors"
                >
                    7
                </button>
                <button
                    onClick={() => inputNumber('8')}
                    className="!rounded-button bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-4 transition-colors"
                >
                    8
                </button>
                <button
                    onClick={() => inputNumber('9')}
                    className="!rounded-button bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-4 transition-colors"
                >
                    9
                </button>
                <button
                    onClick={() => performOperation('-')}
                    className="!rounded-button bg-orange-500 hover:bg-orange-600 text-white font-semibold py-4 transition-colors"
                >
                    -
                </button>

                {/* Third Row */}
                <button
                    onClick={() => inputNumber('4')}
                    className="!rounded-button bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-4 transition-colors"
                >
                    4
                </button>
                <button
                    onClick={() => inputNumber('5')}
                    className="!rounded-button bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-4 transition-colors"
                >
                    5
                </button>
                <button
                    onClick={() => inputNumber('6')}
                    className="!rounded-button bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-4 transition-colors"
                >
                    6
                </button>
                <button
                    onClick={() => performOperation('+')}
                    className="!rounded-button bg-orange-500 hover:bg-orange-600 text-white font-semibold py-4 transition-colors"
                >
                    +
                </button>

                {/* Fourth Row */}
                <button
                    onClick={() => inputNumber('1')}
                    className="!rounded-button bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-4 transition-colors"
                >
                    1
                </button>
                <button
                    onClick={() => inputNumber('2')}
                    className="!rounded-button bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-4 transition-colors"
                >
                    2
                </button>
                <button
                    onClick={() => inputNumber('3')}
                    className="!rounded-button bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-4 transition-colors"
                >
                    3
                </button>
                <button
                    onClick={handleEquals}
                    className="!rounded-button bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 row-span-2 transition-colors"
                >
                    =
                </button>

                {/* Fifth Row */}
                <button
                    onClick={() => inputNumber('0')}
                    className="!rounded-button bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-4 col-span-2 transition-colors"
                >
                    0
                </button>
                <button
                    onClick={inputDecimal}
                    className="!rounded-button bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-4 transition-colors"
                >
                    .
                </button>
            </div>
        </div>
    );
}
