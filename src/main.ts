import { default as express } from 'express';
import { default as bodyParser } from 'body-parser';
import { ExchangeDiff } from './exchange/index.js';
import { PORT } from './constants.js';
import { MessageBot } from './message-bot/index.js';

const app = express();
app.use(bodyParser.json());

const exchangeDiff = new ExchangeDiff();
const messageBot = new MessageBot(exchangeDiff);

app.get('/currencies', async (req, res) => {
  const currencies = exchangeDiff.getAll();
  res.send(currencies);
});

app.get('/currencies/:currency', async (req, res) => {
  res.send(exchangeDiff.getCurrency(req.params.currency.toUpperCase()));
});

app.post('/convert', async (req, res) => {
  const { amount, currency } = req.body;
  const result = exchangeDiff.getConvertedAmount(amount, currency);
  res.send({
    result,
  });
});

app.post('/calculate', async (req, res) => {
  const { amountFrom, amountTo, currencyFrom, currencyTo } = req.body;
  const result = exchangeDiff.calculateDiff(amountFrom, amountTo, currencyFrom.toUpperCase(), currencyTo.toUpperCase());
  res.send({
    result,
  });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});

messageBot.start();
