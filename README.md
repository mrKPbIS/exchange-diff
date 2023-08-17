# exchange-diff

Project for calculating difference of actual exchange rate when changing money.

## External connections

Service is using OpenExchangeRates API. See: https://docs.openexchangerates.org/reference/api-introduction. Add your App ID to env as `APP_ID`
Service can receive messages from Telegram via bot. See: https://core.telegram.org/bots/api. Add your bot api key to env as `TELEGRAM_BOT_API_KEY`

TODO:

- documentation and pretty bot input/output

Done:

- Openexchange API client and calculation
- telegram bot
- dockerfile for app