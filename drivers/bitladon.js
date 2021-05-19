const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils');

/**
 * @memberof Driver
 * @augments Driver
 */
class Bitladon extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const { result: tickers } = await request('https://api.bitladon.com/markets/');

    return tickers.map((ticker) => {
      const { ticker: base } = ticker;

      return new Ticker({
        base,
        baseName: ticker.name,
        quote: 'EUR',
        close: parseToFloat(ticker.last),
        baseVolume: parseToFloat(ticker.volume24h),
        quoteVolume: parseToFloat(ticker.eurovolume24h),
      });
    });
  }
}

module.exports = Bitladon;
