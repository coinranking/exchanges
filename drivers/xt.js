const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils');

/**
 * @memberof Driver
 * @augments Driver
 */
class Xt extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const { result: tickers } = await request('https://sapi.xt.com/v4/public/ticker/24h');

    return tickers.map((ticker) => {
      const [base, quote] = ticker.s.split('_');

      return new Ticker({
        base,
        quote,
        open: parseToFloat(ticker.o),
        high: parseToFloat(ticker.h),
        low: parseToFloat(ticker.l),
        close: parseToFloat(ticker.c),
        baseVolume: parseToFloat(ticker.q),
        quoteVolume: parseToFloat(ticker.v),
      });
    });
  }
}

module.exports = Xt;
