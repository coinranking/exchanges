const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils');

/**
 * @memberof Driver
 * @augments Driver
 */
class Ordinalnovus extends Driver {
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
    const { tokens } = await request('https://ordinalnovus.com/api/v2/cbrc?_limit=100', {
      headers: {
        'X-Api-Key': `${this.key}`,
      },
    });

    return tokens.flatMap((item) => {
      const { tick, price, volume } = item;
      if (!volume) return [];

      return new Ticker({
        base: tick,
        quote: 'BTC',
        close: parseToFloat(price) / 100000000,
        quoteVolume: parseToFloat(volume) / 100000000,
      });
    });
  }
}

module.exports = Ordinalnovus;
