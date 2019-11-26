const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat, throttleMap } = require('../lib/utils.js');

module.exports = async (isMocked) => {
  const { markets } = await request('https://www.buda.com/api/v2/markets.json');

  const tickers = throttleMap(markets, async (market) => {
    const base = market.base_currency;
    const quote = market.quote_currency;

    if (market.disabled) return undefined;

    const { ticker } = await request(`https://www.buda.com/api/v2/markets/${market.name}/ticker.json`);

    return new Ticker({
      base,
      quote,
      baseVolume: parseToFloat(ticker.volume[0]),
      close: parseToFloat(ticker.last_price[0]),
    });
  }, isMocked ? 0 : 50); // Limited to 20 requests a second

  return Promise.all(tickers);
};
