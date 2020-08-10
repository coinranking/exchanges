const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

/**
 * @memberof Driver
 * @augments Driver
 */
class Bitfxt extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const pairs = await request('https://bitfxt.com/api/v1/ticker');

    return Object.keys(pairs).map((pair) => {
      const [base, quote] = pair.split('_');
      const ticker = pairs[pair];

      return new Ticker({
        base,
        quote,
        close: parseToFloat(ticker.last_price),
        baseVolume: parseToFloat(ticker.base_volume),
        quoteVolume: parseToFloat(ticker.quote_volume),
      });
    });
  }
}

module.exports = Bitfxt;
