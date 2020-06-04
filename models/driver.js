const Ticker = require('./ticker');

/**
 * @namespace Driver
 * @class
 */
class Driver {
  /**
   * Drivers must include a fetchTickers method.
   *
   * @namespace Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    throw new Error('must be implemented by driver');
  }
}

module.exports = Driver;
