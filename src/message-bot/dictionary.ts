export function commandsMesssage() {
  return 'Commands:\n'+
        '"c amount1 currency1 amount2 currency2" - calculate difference of given exchange rate from official exchange rate.';
}

export function calculateMessage(percentage: number, diff: number) {
  return `${percentage.toFixed(2)}% difference from official exchange rate. Or ${diff.toFixed(2)} USD`;
}

export function unknownFormatMessage() {
  return 'Unknown format';
}

export function unknownCurrencyMessage(currency = '') {
  return `Unknown currency ${currency}`;
}
