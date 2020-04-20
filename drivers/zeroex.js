const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils');

module.exports = async () => {
  const pairs = await request('https://trade.zeroexcoin.com/api/v2/peatio/public/markets/tickers');

  return Object.keys(pairs).map((pair) => {
    const { ticker } = pairs[pair];
    const base = pair.substring(0, 3);
    const quote = pair.substring(3, pair.length);

    return new Ticker({
      base,
      quote,
      high: parseToFloat(ticker.high),
      low: parseToFloat(ticker.low),
      close: parseToFloat(ticker.last),
      ask: parseToFloat(ticker.sell),
      bid: parseToFloat(ticker.buy),
      baseVolume: parseToFloat(ticker.volume),
    });
  });
};
