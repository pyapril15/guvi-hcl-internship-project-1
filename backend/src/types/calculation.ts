// src/types/calculation.ts
export interface Calculation {
    id?: number;
    operand1: number;
    operator: '+' | '-' | '*' | '/';
    operand2: number;
    result: number;
    timestamp?: Date;
}

export interface CreateCalculationRequest {
    operand1: number;
    operator: '+' | '-' | '*' | '/';
    operand2: number;
    result: number;
}