const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat, throttleMap } = require('../lib/utils.js');

module.exports = async (isMocked) => {
  const pairs = await request('https://api.pro.coinbase.com/products');

  const tickers = throttleMap(pairs, async (pair) => {
    const ticker = await request(`https://api.pro.coinbase.com/products/${pair.id}/ticker`);

    const base = pair.base_currency;
    const quote = pair.quote_currency;

    return new Ticker({
      base,
      quote,
      baseVolume: parseToFloat(ticker.volume),
      close: parseToFloat(ticker.price),
    });
  }, isMocked ? 0 : 334); // Limited to 3 requests a second

  return Promise.all(tickers);
};
