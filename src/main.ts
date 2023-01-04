import { default as express } from 'express';
import { ExchangeDiff } from './exchange/index.js';
import { PORT } from './constants.js';

const app = express();
const exchangeDiff = new ExchangeDiff()

app.get('/currencies', async (req, res) => {
  const currencies = exchangeDiff.getAll();
  res.send(currencies);
})

app.get('/currencies/:currency', async (req, res) => {
  res.send(exchangeDiff.getCurrency(req.params.currency.toUpperCase()));
})

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`)
})