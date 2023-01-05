import { requestCurrencies, requestLatest } from '../ openexchange-client/index.js';
import { CalculateDiffResult, CurrenciesListItem } from './interfaces.js';

export class ExchangeDiff {
    private currenciesList: Map<string, CurrenciesListItem> = new Map();

    constructor() {
        this.init();
    }


    // TODO: update rates daily

    public calculateDiff(amountFrom: number, amountTo: number, currencyFrom: string, currencyTo: string): CalculateDiffResult {
        const convertedFrom = this.convertToUSD(amountFrom, currencyFrom);
        const convertedTo = this.convertToUSD(amountTo, currencyTo);
        const diff = Math.abs(1 - ( convertedFrom / convertedTo)) * 100;
        return {
            convertedFrom,
            convertedTo,
            diff,
        };
    }

    public getAll() {
        return Array.from(this.currenciesList.entries());
    }

    public getCurrency(code: string): CurrenciesListItem {
        return this.currenciesList.get(code);
    }

    public getConvertedAmount(amount: number, code: string): number {
        return this.convertToUSD(amount, code);
    } 

    private convertToUSD(amount: number, currency: string): number {
        const { rate } = this.getCurrency(currency);
        return amount / rate;
    }

    private async init() {
        const currenciesResponse = await requestCurrencies();
        const USDRates = await requestLatest();
        const codes = Object.keys(currenciesResponse);
        codes.map((code) => {
            this.currenciesList.set(code, {
                title: currenciesResponse[code],
                rate: USDRates.rates[code],
            });
        });
    }
}