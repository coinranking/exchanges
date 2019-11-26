const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

module.exports = async () => {
  const data = await request('https://coinsbit.io/api/v1/public/tickers');
  const tickers = data.result;
  const pairs = Object.keys(tickers);

  return pairs.map((pair) => {
    const [base, quote] = pair.split('_');
    const { ticker } = tickers[pair];

    return new Ticker({
      base,
      quote,
      baseVolume: parseToFloat(ticker.vol),
      close: parseToFloat(ticker.last),
      high: parseToFloat(ticker.high),
      low: parseToFloat(ticker.low),
    });
  });
};
