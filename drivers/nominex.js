const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat, throttleMap } = require('../lib/utils.js');

/**
 * @memberof Driver
 * @augments Driver
 */
class Nominex extends Driver {
  /**
   * @param {boolean} isMocked Set to true when stored tickers are used
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers(isMocked) {
    const pairs = await request('https://nominex.io/api/rest/v1/pairs');
    const symbols = pairs.map((item) => item.name);


    const tickers = throttleMap(symbols, async (symbol) => {
      try {
        const data = await request(`https://nominex.io/api/rest/v1/ticker?pairs=${symbol}`);
        const ticker = data[0];
        const [base, quote] = symbol.split('/');

        return new Ticker({
          base,
          quote,
          bid: parseToFloat(ticker.bid),
          ask: parseToFloat(ticker.ask),
          close: parseToFloat(ticker.price),
          high: parseToFloat(ticker.high),
          low: parseToFloat(ticker.low),
          quoteVolume: parseToFloat(ticker.quoteVolume),
        });
      } catch (error) {
        return undefined;
      }
    }, isMocked ? 0 : 20);

    return Promise.all(tickers);
  }
}

module.exports = Nominex;
