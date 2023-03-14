import * as cron from 'node-cron';
import { requestCurrencies, requestLatest } from '../openexchange-client/index.js';
import { CalculateDiffResult, CurrenciesListItem } from './interfaces.js';
import { CRON_SCHEDULE } from '../constants.js';

export class ExchangeDiff {
  private currenciesList: Map<string, CurrenciesListItem> = new Map();

  constructor() {
    this.init();
  }

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

  public isCurrency(value: string): boolean {
    return this.currenciesList.has(value);
  }

  private convertToUSD(amount: number, currency: string): number {
    const { rate } = this.getCurrency(currency);
    return amount / rate;
  }

  private async init() {
    this.updateCurrencies();
    cron.schedule(CRON_SCHEDULE, this.updateCurrencies);
  }

  private async updateCurrencies(): Promise<void>  {
    console.log('loading currencies...');
    console.log(new Date);
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
