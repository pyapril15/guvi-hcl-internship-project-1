// utils/api.ts
import {ApiResponse, CalculationRecord, CreateCalculationRequest} from '../types/calculation';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3006/api';

export class ApiError extends Error {
    constructor(public status: number, message: string) {
        super(message);
        this.name = 'ApiError';
    }
}

const handleResponse = async <T>(response: Response): Promise<T> => {
    const contentType = response.headers.get('content-type');

    if (!contentType || !contentType.includes('application/json')) {
        throw new ApiError(response.status, 'Server returned non-JSON response');
    }

    const data: ApiResponse<T> = await response.json();

    if (!response.ok) {
        throw new ApiError(response.status, data.message || `HTTP ${response.status}: Request failed`);
    }

    if (!data.success) {
        throw new ApiError(response.status, data.message || 'API request was not successful');
    }

    return data.data;
};

const createFetchWithTimeout = (timeout: number = 10000) => {
    return (url: string, options: RequestInit = {}) => {
        return Promise.race([
            fetch(url, options),
            new Promise<Response>((_, reject) =>
                setTimeout(() => reject(new Error('Request timeout')), timeout)
            )
        ]);
    };
};

const fetchWithTimeout = createFetchWithTimeout(10000); // 10 second timeout

export const calculatorApi = {
    async saveCalculation(calculation: CreateCalculationRequest): Promise<CalculationRecord> {
        try {
            const response = await fetchWithTimeout(`${API_BASE_URL}/calculations`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(calculation),
            });

            return await handleResponse<CalculationRecord>(response);
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            // Network error or other issues
            console.error('Save calculation error:', error);
            throw new ApiError(0, 'Network error: Unable to save calculation. Please check your connection.');
        }
    },

    async getCalculations(): Promise<CalculationRecord[]> {
        try {
            const response = await fetchWithTimeout(`${API_BASE_URL}/calculations`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            return await handleResponse<CalculationRecord[]>(response);
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            // Network error or other issues
            console.error('Get calculations error:', error);
            throw new ApiError(0, 'Network error: Unable to fetch calculations. Please check your connection.');
        }
    },

    async checkHealth(): Promise<boolean> {
        try {
            const response = await fetchWithTimeout(`${API_BASE_URL}/health`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json();
                return data.success === true;
            }
            return false;
        } catch (error) {
            console.error('Health check error:', error);
            return false;
        }
    },

    async deleteAllCalculations(): Promise<{ deletedCount: number }> {
        try {
            const response = await fetchWithTimeout(`${API_BASE_URL}/calculations`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            return await handleResponse<{ deletedCount: number }>(response);
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            console.error('Delete all calculations error:', error);
            throw new ApiError(0, 'Network error: Unable to delete calculations. Please check your connection.');
        }
    },

    async deleteCalculationById(id: number): Promise<{ id: number }> {
        try {
            const response = await fetchWithTimeout(`${API_BASE_URL}/calculations/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            return await handleResponse<{ id: number }>(response);
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            console.error('Delete calculation error:', error);
            throw new ApiError(0, 'Network error: Unable to delete calculation. Please check your connection.');
        }
    },
};