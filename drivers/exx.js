const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

module.exports = async () => {
  const data = await request('https://api.exx.com/data/v1/tickers');
  const pairs = Object.keys(data);

  return pairs.map((pair) => {
    const [base, quote] = pair.split('_');
    const ticker = data[pair];

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
