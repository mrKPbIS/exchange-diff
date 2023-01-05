export interface CurrenciesListItem {
    title: string;
    rate: number;
}

export interface CalculateDiffResult {
    convertedFrom: number,
    convertedTo: number,
    diff: number,
}
