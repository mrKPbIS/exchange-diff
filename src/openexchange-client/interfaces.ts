export interface CurrenciesResponse {
    [key: string]: string;
}

export interface LatestResponse {
    disclaimer: string;
    license: string;
    timestamp: number;
    base: string;
    rates: LatestRates;
}

export interface LatestRates {
    [key: string]: number;
}

export interface ErrorResponse {
    url: string;
    body: string;
}

export interface ErrorResponseBody {
    error: boolean;
    status: number;
    message: string;
    description: string;
}
