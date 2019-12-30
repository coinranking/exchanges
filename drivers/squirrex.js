const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

module.exports = async () => {
  const { data: pairs } = await request('https://squirrex.com/api/v1/ticker');

  return Object.keys(pairs).map((pair) => {
    const [base, quote] = pair.split('_');
    const ticker = pairs[pair];

    return new Ticker({
      base,
      quote,
      close: parseToFloat(ticker.last_price),
      baseVolume: parseToFloat(ticker.base_volume),
      quoteVolume: parseToFloat(ticker.quote_volume),
    });
  });
};
