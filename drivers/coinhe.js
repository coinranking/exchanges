const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

module.exports = async () => {
  const pairs = await request('https://api.coinhe.io/v1/market-summary');

  return pairs.map((pair) => {
    const key = Object.keys(pair);
    const [base, quote] = key[0].split('_');
    const ticker = pair[key];

    return new Ticker({
      base,
      quote,
      high: parseToFloat(ticker.high24h),
      low: parseToFloat(ticker.low24h),
      close: parseToFloat(ticker.LastPrice),
      bid: parseToFloat(ticker.highestBid),
      ask: parseToFloat(ticker.lowestAsk),
      baseVolume: parseToFloat(ticker.baseVolume24h),
      quoteVolume: parseToFloat(ticker.quoteVolume24h),
    });
  });
};
