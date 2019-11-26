const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

module.exports = async () => {
  const markets = await request('https://neraex.pro/api/v2/markets');
  const tickers = await request('https://neraex.pro/api/v2/tickers');

  return markets.map((market) => {
    const [base, quote] = market.name.split('/');
    const { ticker } = tickers[market.id];

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
