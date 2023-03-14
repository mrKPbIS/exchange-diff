import got from 'got';
import { baseUri, appId, EXCHANGE_PATH } from './constants.js';
import { ErrorResponse, ErrorResponseBody, CurrenciesResponse, LatestResponse } from './interfaces.js';


export async function requestCurrencies(): Promise<CurrenciesResponse> {
  return await requestOpenExchange<CurrenciesResponse>(`${baseUri}/${EXCHANGE_PATH.CURRENCIES}`);
}

export async function requestLatest(): Promise<LatestResponse> {
  return await requestOpenExchange<LatestResponse>(`${baseUri}/${EXCHANGE_PATH.LATEST}`);
}

async function requestOpenExchange<T>(uri: string): Promise<T | null> {
  let response: T | null = null;
  try {
    const searchParams = new URLSearchParams({
      app_id: appId,
    });
    response = await got.get(uri, { searchParams }).json<T>();
  } catch (error) {
    handleError(error.response);
  }
  return response;
}

function handleError(response: ErrorResponse) {
  const body: ErrorResponseBody = JSON.parse(response.body);
  console.log(`Error during request ${response.url}. Code: ${body.status}, description: ${body.description}`);
}
