export const baseUri = 'https://openexchangerates.org/api';
export const appId = process.env['APP_ID'];

export enum EXCHANGE_PATH {
    CURRENCIES = 'currencies.json',
    LATEST = 'latest.json',
}
