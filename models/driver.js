const Ticker = require('./ticker');

/**
 * @namespace Driver
 * @class
 * @param {object} config - An object holding the configuration
 * @param {object} config.requires
 *   An object with settings that a driver requires
 * @param {boolean} config.requires.key
 *   Set to true if the driver requires an API key; default: false
 * @param {object} config.supports
 *   An object with settings that a driver supports
 * @param {boolean} config.supports.specificMarkets
 *   Set to true if the driver supports getting specific markets; default: false
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

    this.supports = {
      specificMarkets: false,
    };

    if (config) {
      this.requires = {
        ...this.requires,
        ...config.requires,
      };

      this.supports = {
        ...this.supports,
        ...config.supports,
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

  /**
   * Get the specific markets filter
   *
   * @returns {string[]} ids An array of market ids
   */
  get markets() {
    if (!this.supports.specificMarkets) {
      throw new Error('This driver does not support getting specific markets');
    }

    return this._markets;
  }

  /**
   * Set the specific markets filter
   *
   * @param {string[]} ids An array of market ids
   */
  set markets(ids) {
    if (!this.supports.specificMarkets) {
      throw new Error('This driver does not support getting specific markets');
    }

    this._markets = ids;
  }
}

module.exports = Driver;
