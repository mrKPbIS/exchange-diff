export interface RequestCurrenciesResponse {
    [key: string]: string;
}

export interface RequestLatestResponse {
    disclaimer: string;
    license: string;
    timestamp: number;
    base: string;
    rates: RequestLatestRates;
}

export interface RequestLatestRates {
    [key: string]: number;
}

export interface ErrorResponse {
    error: boolean;
    status: number;
    message: string;
    description: string;
}