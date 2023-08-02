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
    const { data } = await request('https://www.bydfi.com/b2b/rank/all');
    const tickers = Object.keys(data).map((market) => {
      const ticker = data[market];

      return new Ticker({
        base: ticker.base_currency,
        quote: ticker.quote_currency,
        baseVolume: parseToFloat(ticker.base_volume),
        quoteVolume: parseToFloat(ticker.quote_volume),
        high: parseToFloat(ticker.highest_price_24h),
        low: parseToFloat(ticker.lowest_price_24h),
        close: parseToFloat(ticker.last_price),
        ask: parseToFloat(ticker.lowest_ask),
        bid: parseToFloat(ticker.highest_bid),
      });
    });

    return tickers;
  }
}

module.exports = Bydfi;
