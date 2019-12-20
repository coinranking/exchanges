const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat, throttleMap } = require('../lib/utils.js');

module.exports = async (isMocked) => {
  const { data: pairs } = await request('https://openapi.dcoin.com/open/api/common/symbols');

  const tickers = throttleMap(pairs, async (pair) => {
    const base = pair.count_coin;
    const quote = pair.base_coin;
    const { data: ticker } = await request(`https://openapi.dcoin.com/open/api/get_ticker?symbol=${pair.symbol}`);

    return new Ticker({
      base,
      quote,
      high: parseToFloat(ticker.high),
      low: parseToFloat(ticker.low),
      close: parseToFloat(ticker.close),
      baseVolume: parseToFloat(ticker.vol),
    });
  }, isMocked ? 0 : 50); // Batches of 20 requests per second

  return Promise.all(tickers);
};
