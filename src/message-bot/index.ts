import { default as Telebot } from 'telebot';
import { TELEGRAM_BOT_API_KEY } from './constants.js';
import { calculateMessage, commandsMesssage, unknownCurrencyMessage, unknownFormatMessage } from './dictionary.js';
import { ExchangeDiff } from '../exchange/index.js';

export class MessageBot {
  private bot: Telebot;
  private exchangeDiff: ExchangeDiff;

  constructor(exchangeDiff: ExchangeDiff) {
    this.exchangeDiff = exchangeDiff;
    this.init();
  }

  public start(): void {
    this.bot.start();
  }

  private init() {
    this.bot = new Telebot({
      token: TELEGRAM_BOT_API_KEY,
    });
      
    this.bot.on('/start', (msg) => {
      return msg.reply.text(commandsMesssage());
    });

    this.bot.on(/^[cC] (.+)$/, (msg, props) => {
      const params: string[] = props.match[1].split(' ');
      if (params.length != 4) {
        msg.reply.text(unknownFormatMessage);
        return;
      }
      const [amountFrom, currencyFrom, amountTo, currencyTo] = params;
      if (![currencyFrom, currencyTo].every(this.exchangeDiff.isCurrency)) {
        msg.reply.text(unknownCurrencyMessage());
        return;
      }
    
      const result = this.exchangeDiff.calculateDiff(parseFloat(amountFrom), parseFloat(amountTo), currencyFrom.toUpperCase(), currencyTo.toUpperCase());
      msg.reply.text(calculateMessage(result.diff, Math.abs(result.convertedFrom-result.convertedTo)));
    });
  }
}
