const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { throttleMap, parseToFloat } = require('../lib/utils');

/**
 * @memberof Driver
 * @augments Driver
 */
class Atomars extends Driver {
  /**
   * @param {boolean} isMocked Set to true when stored tickers are used
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers(isMocked) {
    const { data: symbols } = await request('https://api.atomars.com/v1/public/symbols');
    const pairs = {};

    symbols.forEach((el) => {
      pairs[el.pair] = {
        base: el.base,
        quote: el.quote,
      };
    });

    const tickers = throttleMap(Object.keys(pairs), async (pair) => {
      const { data: ticker } = await request(`https://api.atomars.com/v1/public/ticker?pair=${pair}`);
      const { base, quote } = pairs[pair];

      return new Ticker({
        base,
        quote,
        high: parseToFloat(ticker.high),
        low: parseToFloat(ticker.low),
        close: parseToFloat(ticker.last),
        baseVolume: parseToFloat(ticker.volume_24H),
      });
    }, isMocked ? 0 : 50); // 20 requests per second

    return Promise.all(tickers);
  }
}

module.exports = Atomars;
