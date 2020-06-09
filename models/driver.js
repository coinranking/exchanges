const Ticker = require('./ticker');

/**
 * @namespace Driver
 * @class
 */
class Driver {
  constructor(config) {
    this.requires = {
      key: false,
    };

    if (config) {
      this.requires = {
        ...this.requires,
        ...config.requires,
      };
    }
  }

  /**
   * Drivers must include a fetchTickers method.
   *
   * @namespace Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    throw new Error('must be implemented by driver');
  }

  /**
   *
   * @returns {string} API Key
   */
  get key() {
    if (!this.requires.key) {
      throw new Error('This driver is not configured to require an API key');
    }

    if (!this._key) {
      throw new Error('API key isn\'t set');
    }

    return this._key;
  }

  /**
   *
   * @param {string} key API Key
   */
  set key(key) {
    if (!this.requires.key) {
      throw new Error('This driver is not configured to require an API key');
    }

    this._key = key;
  }
}

module.exports = Driver;
