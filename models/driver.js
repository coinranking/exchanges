const Ticker = require('./ticker');

/**
 * @namespace Driver
 * @class
 *
 * @param {object} config - An object holding the configuration
 * @param {object} config.requires
 *   An object with settings that a driver requires
 * @param {boolean} config.requires.key
 *   Set to true if the driver requires an API key; default: false
 * @example
 * // An example of a driver with an API key
 * class ApiKeyDriver extends Driver {
 *   // Indicate that this driver requires an API key.
 *   constructor() {
 *     super({
 *       requires: {
 *         key: true,
 *       },
 *     });
 *   }
 *
 *   async fetchTickers() {
 *     // The API key can now be accessed through this.key.
 *     const tickers = await request(`http://api.example.com/tickers?key=${this.key}`);
 *     return tickers.map((ticker) => {
 *       const {
 *         base, quote, close, baseVolume,
 *       } = ticker;
 *
 *       return new Ticker({
 *         base,
 *         quote,
 *         close,
 *         baseVolume,
 *       });
 *     });
 *   }
 * }
 *
 * // An example of a driver without an API key
 * class BasicDriver extends Driver {
 *   async fetchTickers() {
 *     // Perform an API request to get the data of the exchange.
 *     const tickers = await request('http://api.example.com/tickers');
 *
 *     // Return the data mapped to instances of the Ticker model,
 *     // the exact way will differ for every exchange.
 *     return tickers.map((ticker) => {
 *       const {
 *         base, quote, close, baseVolume,
 *       } = ticker;
 *
 *       return new Ticker({
 *         base,
 *         quote,
 *         close,
 *         baseVolume,
 *       });
 *     });
 *   }
 * }
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
   * Get the API key if it is set
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
   * Set the API key
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
