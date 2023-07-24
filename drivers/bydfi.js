const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils');

/**
 * @memberof Driver
 * @augments Driver
 */
class Bydfi extends Driver {
  /**
   * @param {boolean} isMocked Set to true when stored tickers are used
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const { data: markets } = await request('https://www.bydfi.com/b2b/rank/contracts');

    const tickers = markets.map((market) => new Ticker({
      base: market.base_currency,
      quote: market.quote_currency,
      baseVolume: parseToFloat(market.base_volume),
      quoteVolume: parseToFloat(market.quote_volume),
      high: parseToFloat(market.high),
      low: parseToFloat(market.low),
      close: parseToFloat(market.last_price),
      ask: parseToFloat(market.ask),
      bid: parseToFloat(market.bid),
    }));

    return tickers;
  }
}

module.exports = Bydfi;
