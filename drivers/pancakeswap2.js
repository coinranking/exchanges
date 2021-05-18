const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

/**
 * @memberof Driver
 * @augments Driver
 */
class Pancakeswap2 extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const { data: tickers } = await request('https://api.pancakeswap.info/api/v2/pairs');

    return Object.keys(tickers).map((key) => {
      const ticker = tickers[key];

      return new Ticker({
        base: ticker.base_symbol,
        baseName: ticker.base_name,
        baseReference: ticker.base_address,
        quote: ticker.quote_symbol,
        quoteName: ticker.quote_name,
        quoteReference: ticker.quote_address,
        close: parseToFloat(ticker.price),
        baseVolume: parseToFloat(ticker.base_volume),
        quoteVolume: parseToFloat(ticker.quote_volume),
      });
    });
  }
}

module.exports = Pancakeswap2;
