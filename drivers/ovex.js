const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

module.exports = async () => {
  const pairs = await request('https://www.ovex.io/api/v2/tickers');

  return Object.keys(pairs).map((pair) => {
    const { ticker } = pairs[pair];
    const base = pairs[pair].ask_unit;
    const quote = pairs[pair].bid_unit;

    return new Ticker({
      base,
      quote,
      high: parseToFloat(ticker.high),
      low: parseToFloat(ticker.low),
      close: parseToFloat(ticker.last),
      baseVolume: parseToFloat(ticker.volume),
    });
  });
};
