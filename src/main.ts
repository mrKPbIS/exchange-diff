import { default as express } from 'express';
import { default as bodyParser } from 'body-parser';
import { default as Telebot } from 'telebot';
import { ExchangeDiff } from './exchange/index.js';
import { PORT, TELEGRAM_BOT_API_KEY } from './constants.js';

const app = express();
app.use(bodyParser.json());

const bot = new Telebot({
  token: TELEGRAM_BOT_API_KEY,
})

const exchangeDiff = new ExchangeDiff();

app.get('/currencies', async (req, res) => {
  const currencies = exchangeDiff.getAll();
  res.send(currencies);
})

app.get('/currencies/:currency', async (req, res) => {
  res.send(exchangeDiff.getCurrency(req.params.currency.toUpperCase()));
})

app.post('/convert', async (req, res) => {
  const { amount, currency } = req.body;
  const result = exchangeDiff.getConvertedAmount(amount, currency);
  res.send({
    result,
  })
})

app.post('/calculate', async (req, res) => {
  const { amountFrom, amountTo, currencyFrom, currencyTo } = req.body;
  const result = exchangeDiff.calculateDiff(amountFrom, amountTo, currencyFrom.toUpperCase(), currencyTo.toUpperCase());
  res.send({
    result,
  });
})

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`)
})

bot.on('/start', (msg) => {
  msg.reply.text('Welcome!');
});

bot.on(/^\/calculate (.+)$/, (msg, props) => {
  const params: string[] = props.match[1].split(' ');
  if (params.length != 4) {
    msg.reply.text('Unknown format');
    return;
  }
  const [amountFrom, currencyFrom, amountTo, currencyTo] = params;
  if (!exchangeDiff.isCurrency(currencyFrom.toUpperCase()) || !exchangeDiff.isCurrency(currencyTo.toUpperCase())) {
    msg.reply.text(`Unknown currency`);
    return;
  }

  const result = exchangeDiff.calculateDiff(parseInt(amountFrom), parseInt(amountTo), currencyFrom.toUpperCase(), currencyTo.toUpperCase());

  msg.reply.text(`${result.diff}% difference from official exchange rate. Or ${Math.abs(result.convertedFrom-result.convertedTo)} USD`);
})

bot.start();
