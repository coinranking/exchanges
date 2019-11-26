const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat, throttleMap } = require('../lib/utils.js');

module.exports = async (isMocked) => {
  const { markets } = await request('https://api.btcmarkets.net/v2/market/active');

  const tickers = throttleMap(markets, async (market) => {
    const base = market.instrument;
    const quote = market.currency;

    const ticker = await request(`https://api.btcmarkets.net/market/${base}/${quote}/tick`);

    return new Ticker({
      base,
      quote,
      baseVolume: parseToFloat(ticker.volume24h),
      high: parseToFloat(ticker.high24h),
      low: parseToFloat(ticker.low24h),
      close: parseToFloat(ticker.lastPrice),
    });
  }, isMocked ? 0 : 50); // Limited to 20 requests a second

  return Promise.all(tickers);
};
