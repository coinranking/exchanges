const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

/**
 * @memberof Driver
 * @augments Driver
 */
class Pancakeswap extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const { trade_pairs: tickers } = await request('https://api.pancakeswap.com/api/v1/stat');

    return tickers.map((ticker) => new Ticker({
      base: ticker.base_symbol,
      baseReference: ticker.base_address,
      quote: ticker.quote_symbol,
      quoteReference: ticker.quote_address,
      close: parseToFloat(ticker.last_price),
      baseVolume: parseToFloat(ticker.base_volume_24_h),
      quoteVolume: parseToFloat(ticker.quote_volume_24_h),
    }));
  }
}

module.exports = Pancakeswap;
