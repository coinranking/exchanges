const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

/**
 * @memberof Driver
 * @augments Driver
 */
class Openledger extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const markets = await request('https://stats.openledger.info/api/asset/pairs');
    const tickers = Object.values(markets);

    return tickers.map((ticker) => {
    // Warning: openledger inverts base and quote!
      const base = ticker.quoteName;
      const quote = ticker.baseName;

      return new Ticker({
        base,
        quote,
        quoteVolume: parseToFloat(ticker.baseVolume),
        baseVolume: parseToFloat(ticker.quoteVolume),
        close: parseToFloat(ticker.last),
      });
    });
  }
}

module.exports = Openledger;
