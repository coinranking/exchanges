const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');

/**
 * Example of a minimal driver.
 *
 * @memberof Driver
 * @augments Driver
 */
class BasicDriver extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    // Perform an API request to get the data of the exchange.
    const data = await request('http://...');

    // Return the data mapped to instances of the Ticker model, the exact way will differ for every
    // exchange.
    return data.map((item) => {
      const {
        base, quote, close, baseVolume,
      } = item;

      return new Ticker({
        base,
        quote,
        close,
        baseVolume,
      });
    });
  }
}

module.exports = BasicDriver;
