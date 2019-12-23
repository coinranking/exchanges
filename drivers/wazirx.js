const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

module.exports = async () => {
  const pairs = await request('https://api.wazirx.com/api/v2/tickers');

  return Object.keys(pairs).map((pair) => {
    const ticker = pairs[pair];

    return new Ticker({
      base: ticker.base_unit,
      quote: ticker.quote_unit,
      high: parseToFloat(ticker.high),
      low: parseToFloat(ticker.low),
      close: parseToFloat(ticker.last),
      bid: parseToFloat(ticker.buy),
      ask: parseToFloat(ticker.sell),
      baseVolume: parseToFloat(ticker.volume),
    });
  });
};
