const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils');

/**
 * @memberof Driver
 * @augments Driver
 */
class Jupiter extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const tickers = await request('https://stats.jup.ag/coingecko/tickers');

    return tickers.map((ticker) => new Ticker({
      base: ticker.base_currency || ticker.base_address,
      quote: ticker.target_currency || ticker.quote_address,
      baseReference: ticker.base_address,
      quoteReference: ticker.target_address,
      baseVolume: parseToFloat(ticker.base_volume),
      quoteVolume: parseToFloat(ticker.target_volume),
      high: parseToFloat(ticker.high),
      low: parseToFloat(ticker.low),
      close: parseToFloat(ticker.last_price),
    }));
  }
}

module.exports = Jupiter;
