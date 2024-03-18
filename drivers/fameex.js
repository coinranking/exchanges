const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils');

/**
 * @memberof Driver
 * @augments Driver
 */
class Fameex extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const { data } = await request('https://api.fameex.com/v2/public/ticker');

    return Object.keys(data).flatMap((market) => {
      const ticker = data[market];
      if (ticker.isFrozen) return [];
      return new Ticker({
        base: ticker.base_id,
        quote: ticker.quote_id,
        close: parseToFloat(ticker.last_price),
        baseVolume: parseToFloat(ticker.base_volume),
        quoteVolume: parseToFloat(ticker.quote_volume),
      });
    });
  }
}

module.exports = Fameex;
