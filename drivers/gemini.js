const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat, throttleMap } = require('../lib/utils.js');

module.exports = async (isMocked) => {
  const pairs = await request('https://api.gemini.com/v1/symbols');

  const tickers = throttleMap(pairs, async (pair) => {
    try {
      const ticker = await request(`https://api.gemini.com/v1/pubticker/${pair}`);

      const [, base, quote] = /^(.{3})(.{3})$/.exec(pair);

      return new Ticker({
        base,
        quote,
        quoteVolume: parseToFloat(ticker.volume[quote.toUpperCase()]),
        baseVolume: parseToFloat(ticker.volume[base.toUpperCase()]),
        close: parseToFloat(ticker.last),
      });
    } catch (error) {
      return undefined;
    }
  }, isMocked ? 0 : 200); // Batches of 5 requests per second

  return Promise.all(tickers);
};
