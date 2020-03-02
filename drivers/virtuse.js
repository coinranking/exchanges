const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat, throttleMap } = require('../lib/utils.js');

module.exports = async (isMocked) => {
  const pairs = await request({
    url: 'https://virtuse.exchange/api/v1',
    method: 'post',
    form: {
      method: 'public/get_pairs',
    },
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const tickers = throttleMap(
    Object.keys(pairs),
    async (pair) => {
      try {
        const data = await request({
          url: 'https://virtuse.exchange/api/v1',
          method: 'post',
          form: {
            method: 'public/get_ticker',
            pair,
          },
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const ticker = data[pair];
        const { base: baseVolume, quote: quoteVolume } = ticker.volume;

        return new Ticker({
          base: ticker.base,
          quote: ticker.quote,
          high: parseToFloat(ticker.high),
          low: parseToFloat(ticker.low),
          close: parseToFloat(ticker.last),
          baseVolume: parseToFloat(baseVolume),
          quoteVolume: parseToFloat(quoteVolume),
        });
      } catch (error) {
        return undefined;
      }
    },
    isMocked ? 0 : 50,
  ); // 20 requests per second

  return Promise.all(tickers);
};
