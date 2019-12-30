const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

module.exports = async () => {
  const pairs = await request('https://api.uniswap.info/v1/tickers');

  return Object.keys(pairs).map((pair) => {
    const ticker = pairs[pair];

    return new Ticker({
      base: ticker.base_symbol,
      baseName: ticker.base_name,
      quote: ticker.quote_symbol,
      quoteName: ticker.quote_name,
      close: parseToFloat(ticker.last_price),
      baseVolume: parseToFloat(ticker.base_volume),
      quoteVolume: parseToFloat(ticker.quote_volume),
    });
  });
};
