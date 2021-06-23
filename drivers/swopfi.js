const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils');

/**
 * @memberof Driver
 * @augments Driver
 */
class Swopfi extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const tickers = await request('https://backend.swop.fi/market-api/v0/tickers');

    return Object.values(tickers).map((ticker) => new Ticker({
      base: ticker.base_symbol,
      baseName: ticker.base_name,
      baseReference: ticker.base_id,
      quote: ticker.quote_symbol,
      quoteName: ticker.quote_name,
      quoteReference: ticker.quote_id,
      close: parseToFloat(ticker.last_price),
      baseVolume: parseToFloat(ticker.base_volume),
      quoteVolume: parseToFloat(ticker.quote_volume),

    }));
  }
}

module.exports = Swopfi;
