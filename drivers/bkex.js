const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat, throttleMap } = require('../lib/utils');

/**
 * @memberof Driver
 * @augments Driver
 */
class Bkex extends Driver {
  /**
   * @param {boolean} isMocked Set to true when stored tickers are used
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers(isMocked) {
    const { data: { pairs } } = await request('https://api.bkex.com/v1/exchangeInfo');

    const tickers = throttleMap(pairs, async (pair) => {
      const { pair: pairName } = pair;
      const [base, quote] = pairName.split('_');

      const { data: ticker } = await request(`https://api.bkex.com/v1/q/ticker?pair=${pairName}`);

      return new Ticker({
        base,
        quote,
        high: parseToFloat(ticker.h),
        low: parseToFloat(ticker.l),
        close: parseToFloat(ticker.c),
        baseVolume: parseToFloat(ticker.a),
        quoteVolume: parseToFloat(ticker.v),
      });
    }, isMocked ? 0 : 50); // Limited to 20 requests a second

    return Promise.all(tickers);
  }
}

module.exports = Bkex;
