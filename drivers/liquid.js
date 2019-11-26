const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

module.exports = async () => {
  const tickers = await request('https://api.liquid.com/products');

  return tickers
    .filter((ticker) => ticker.disabled === false)
    .map((ticker) => {
      const base = ticker.base_currency;
      const quote = ticker.quoted_currency;

      return new Ticker({
        base,
        quote,
        baseVolume: parseToFloat(ticker.volume_24h),
        close: parseToFloat(ticker.last_traded_price),
        vwap: parseToFloat(ticker.last_price_24h),
      });
    });
};
