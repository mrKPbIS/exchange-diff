import * as cron from 'node-cron';
import * as fs from 'fs';
import { requestCurrencies, requestLatest } from '../openexchange-client/index.js';
import { CalculateDiffResult, ConvertAmountResult, CurrenciesListItem } from './interfaces.js';
import { CRON_SCHEDULE, EXCHANGES_FILE_NAME } from './constants.js';

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

  public convertAmount(amount: number, currencyFrom: string, currencyTo: string): ConvertAmountResult {
    const rateFrom = this.getCurrency(currencyFrom).rate;
    const rateTo = this.getCurrency(currencyTo).rate;
    const rate = (1 / rateFrom) / (1 / rateTo);
    return {
      rate,
      amount: rate*amount,
    };
  }

  public getAll(): Array<[string, CurrenciesListItem]> {
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
    const data = await this.readFromFile();
    if (data.length === 0) {
      await this.updateCurrencies();
    } else {
      console.log('currencies loaded from file...');
      const list: [string, CurrenciesListItem][] = JSON.parse(data);
      for(const item of list) {
        this.currenciesList.set(item[0], item[1]);
      }
    }
    
    cron.schedule(CRON_SCHEDULE, async () => { await this.updateCurrencies();});
  }

  private async updateCurrencies(): Promise<void>  {
    console.log('requesting currencies...');
    const currenciesResponse = await requestCurrencies();
    const USDRates = await requestLatest();
    const codes = Object.keys(currenciesResponse);
    codes.map((code) => {
      this.currenciesList.set(code, {
        title: currenciesResponse[code],
        rate: USDRates.rates[code],
      });
    });
    const data = this.getAll();
    this.writeToFile(JSON.stringify(data));
  }

  private writeToFile(data: string): void {
    const writableStream = fs.createWriteStream(EXCHANGES_FILE_NAME);
    writableStream.write(data);
    writableStream.close();
  }

  private async readFromFile(): Promise<string> {
    let result = '';
    const readableStream = fs.createReadStream(EXCHANGES_FILE_NAME, 'utf-8');
    try {
      for await (const chunk of readableStream) {
        result += chunk;
      }
    } 
    catch (error) {
      console.log(error.message);
    }
    finally {
      readableStream.close();
    }
    return result;
  }
}
