// types/calculation.ts
export interface CalculationRecord {
    id: number;
    operand1: number;
    operator: string;
    operand2: number;
    result: number;
    timestamp: string;
}

export interface CreateCalculationRequest {
    operand1: number;
    operator: '+' | '-' | '*' | '/';
    operand2: number;
    result: number;
}

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
    meta?: {
        total: number;
        count: number;
    };
}