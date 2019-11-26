const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

module.exports = async () => {
  const tickers = await request('https://bitlish.com/api/v1/tickers');
  const markets = Object.keys(tickers);

  return markets.map((market) => {
    const [, base, quote] = /^(.{3})(.{3})$/.exec(market);
    const ticker = tickers[market];

    return new Ticker({
      base,
      quote,
      baseVolume: parseToFloat(ticker.sum),
      close: parseToFloat(ticker.last),
      open: parseToFloat(ticker.first),
      high: parseToFloat(ticker.max),
      low: parseToFloat(ticker.min),
    });
  });
};
