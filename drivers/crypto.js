const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

/**
 * @memberof Driver
 * @augments Driver
 */
class Crypto extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const {
      result: { data: tickers },
    } = await request('https://uat-api.3ona.co/v2/public/get-ticker');

    return tickers.map((ticker) => {
      const [base, quote] = ticker.i.split('_');

      return new Ticker({
        base,
        quote,
        high: parseToFloat(ticker.h),
        low: parseToFloat(ticker.l),
        close: parseToFloat(ticker.a),
        bid: parseToFloat(ticker.b),
        ask: parseToFloat(ticker.k),
        quoteVolume: parseToFloat(ticker.v),
      });
    });
  }
}

module.exports = Crypto;
