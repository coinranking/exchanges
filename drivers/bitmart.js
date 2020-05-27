const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

/**
 * @memberof Driver
 * @augments Driver
 */
class Bitmart extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const tickers = await request('https://openapi.bitmart.com/v2/ticker');

    return tickers.map((ticker) => {
      const [base, quote] = ticker.url.split('=').pop().split('_');

      return new Ticker({
        base,
        quote,
        high: parseToFloat(ticker.highest_price),
        low: parseToFloat(ticker.lowest_price),
        close: parseToFloat(ticker.current_price),
        baseVolume: parseToFloat(ticker.volume),
        // I know, Bitmart inverts base and quote :)
        quoteVolume: parseToFloat(ticker.base_volume),
      });
    });
  }
}

module.exports = Bitmart;
