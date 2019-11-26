const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { throttleMap, parseToFloat } = require('../lib/utils');

module.exports = async (isMocked) => {
  const markets = await request('https://api.exchange.coinjar.com/products');

  const tickers = throttleMap(markets, async (market) => {
    const ticker = await request(`https://data.exchange.coinjar.com/products/${market.id}/ticker`);

    if (!ticker) return undefined;

    const base = market.base_currency.iso_code;
    const quote = market.counter_currency.iso_code;

    return new Ticker({
      base,
      quote,
      baseVolume: parseToFloat(ticker.volume_24h),
      close: parseToFloat(ticker.last),
    });
  }, isMocked ? 0 : 200); // 5 requests per second

  return Promise.all(tickers);
};
