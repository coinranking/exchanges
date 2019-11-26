const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

module.exports = async () => {
  const tickers = await request('https://api.exmo.com/v1/ticker/');
  const pairs = Object.keys(tickers);

  return pairs.map((pair) => {
    const [base, quote] = pair.split('_');
    const ticker = tickers[pair];

    return new Ticker({
      base,
      quote,
      quoteVolume: parseToFloat(ticker.vol_curr),
      baseVolume: parseToFloat(ticker.vol),
      close: parseToFloat(ticker.last_trade),
      high: parseToFloat(ticker.high),
      low: parseToFloat(ticker.low),
      vwap: parseToFloat(ticker.avg),
    });
  });
};
