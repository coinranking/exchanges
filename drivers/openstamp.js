const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils');

/**
 * @memberof Driver
 * @augments Driver
 */
class Openstamp extends Driver {
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
    const { data } = await request('https://openstamp.io/api/v1/src20/getMarketTokenList?page=1&pageSize=100', {
      headers: {
        Authorization: `${this.key}`,
      },
    });

    return data.list.map((item) => {
      const {
        name, price, volume24, amount24,
      } = item;

      return new Ticker({
        base: name,
        quote: 'BTC',
        close: parseToFloat(price) / 10 ** 8,
        baseVolume: parseToFloat(amount24),
        quoteVolume: parseToFloat(volume24) / 10 ** 8,
      });
    });
  }
}

module.exports = Openstamp;
