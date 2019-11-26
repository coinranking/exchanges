const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

module.exports = async () => {
  const markets = await request('https://graviex.net/api/v2/markets');
  const tickers = await request('https://graviex.net/api/v2/tickers');

  return markets.map((market) => {
    const { ticker } = tickers[market.id];
    if (!ticker) return undefined;

    const [base, quote] = market.name.split('/');

    return new Ticker({
      base,
      quote,
      baseVolume: parseToFloat(ticker.vol),
      high: parseToFloat(ticker.high),
      low: parseToFloat(ticker.low),
      close: parseToFloat(ticker.last),
    });
  });
};
