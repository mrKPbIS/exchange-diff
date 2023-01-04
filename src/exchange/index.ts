import { requestCurrencies, requestLatest } from '../ openexchange-client/index.js';
import { CurrenciesListItem } from './interfaces.js';

export class ExchangeDiff {
    private currenciesList: Map<string, CurrenciesListItem> = new Map();

    constructor() {
        this.init();
    }

    public getAll() {
        return Array.from(this.currenciesList.entries());
    }

    public getCurrency(code: string): CurrenciesListItem {
        return this.currenciesList.get(code);
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