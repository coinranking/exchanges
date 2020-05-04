const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat, throttleMap } = require('../lib/utils.js');


module.exports = async (isMocked) => {
  const { pairs } = await request('https://api.hollaex.com/v1/constant');

  const tickers = throttleMap(Object.keys(pairs), async (pair) => {
    const ticker = await request(`https://api.hollaex.com/v1/ticker?symbol=${pair}`);
    const [base, quote] = pair.split('-');

    return new Ticker({
      base,
      quote,
      high: parseToFloat(ticker.high),
      low: parseToFloat(ticker.low),
      close: parseToFloat(ticker.last),
      baseVolume: parseToFloat(ticker.volume),
    });
  }, isMocked ? 0 : 50); // 20 requests per second

  return Promise.all(tickers);
};
