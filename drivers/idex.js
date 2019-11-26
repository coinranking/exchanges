const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

module.exports = async () => {
  const data = await request('https://api.idex.market/returnTicker');
  const pairs = Object.keys(data);

  return pairs.map((pair) => {
    const [quote, base] = pair.split('_');
    const ticker = data[pair];
    if (!ticker) return undefined;

    return new Ticker({
      base,
      quote,
      baseVolume: parseToFloat(ticker.quoteVolume),
      quoteVolume: parseToFloat(ticker.baseVolume),
      high: parseToFloat(ticker.high),
      low: parseToFloat(ticker.low),
      close: parseToFloat(ticker.last),
    });
  });
};
