const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

module.exports = async () => {
  const pairs = ['XBTUSD', 'XBTEUR', 'XBTSGD', 'ETHUSD', 'ETHEUR', 'ETHSGD', 'PAXGUSD'];

  const tickers = pairs.map(async (pair) => {
    const data = await request(`https://api.itbit.com/v1/markets/${pair}/ticker`);

    const quote = pair.substr(pair.length - 3);
    const base = pair.substr(0, pair.length - quote.length);

    return new Ticker({
      base,
      quote,
      high: parseToFloat(data.high24h),
      low: parseToFloat(data.low24h),
      close: parseToFloat(data.lastPrice),
      bid: parseToFloat(data.bid),
      ask: parseToFloat(data.ask),
      vwap: parseToFloat(data.vwap24h),
      baseVolume: parseToFloat(data.volume24h),

    });
  });

  return Promise.all(tickers);
};
