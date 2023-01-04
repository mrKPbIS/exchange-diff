import got from 'got';
import { baseUri, appId, EXCHANGE_PATH } from './constants.js';
import { ErrorResponse, RequestCurrenciesResponse, RequestLatestResponse } from './interfaces.js';


export async function requestCurrencies(): Promise<RequestCurrenciesResponse> {
    return await requestOpenExchange<RequestCurrenciesResponse>(`${baseUri}/${EXCHANGE_PATH.CURRENCIES}`, {
        app_id: appId, 
    })
}

export async function requestLatest(): Promise<RequestLatestResponse> {
    return await requestOpenExchange<RequestLatestResponse>(`${baseUri}/${EXCHANGE_PATH.LATEST}`, {
        app_id: appId,
        // Not allowed on free subscription
        // base: currencyCode,
    })
}

async function requestOpenExchange<T>(uri: string, data: any): Promise<T> {
    let response;
    try {
        response = await got.get(uri, { searchParams: data }).json<T>();
    } catch (error) {
        handleError(error.response);
    }
    return response;
}

function handleError(response: any) {
    const body: ErrorResponse = JSON.parse(response.body);
    console.log(`Error during request ${response.url}. Code: ${body.status}, description: ${body.description}`);
}
