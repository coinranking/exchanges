const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

module.exports = async () => {
  const pairs = await request('https://marketcap.backend.currency.com/api/v1/ticker');

  return Object.keys(pairs).map((pair) => {
    const ticker = pairs[pair];

    return new Ticker({
      base: ticker.base_currency,
      quote: ticker.quote_currency,
      close: parseToFloat(ticker.last_price),
      baseVolume: parseToFloat(ticker.base_volume),
      quoteVolume: parseToFloat(ticker.quote_volume),
    });
  });
};
