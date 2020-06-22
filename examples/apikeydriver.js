const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');

/**
 * Example showing a driver that uses an API requiring a key.
 *
 * @memberof Driver
 * @augments Driver
 */
class ApiKeyDriver extends Driver {
  // Indicate that this driver requires an API key.
  constructor() {
    super({
      requires: {
        key: true,
      },
    });
  }

  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    // The API key can now be accessed through this.key.
    const data = await request(`http://...?key=${this.key}`);

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

module.exports = ApiKeyDriver;
