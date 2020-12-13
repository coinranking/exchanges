const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

/**
 * @memberof Driver
 * @augments Driver
 */
class Mintme extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const tickers = await request('https://www.mintme.com/dev/api/v2/open/summary/');

    return tickers.map((ticker) => {
      const { base_currency: base, quote_currency: quote } = ticker;

      return new Ticker({
        base,
        quote,
        high: parseToFloat(ticker.highest_price_24h),
        low: parseToFloat(ticker.lowest_price_24h),
        close: parseToFloat(ticker.last_price),
        bid: parseToFloat(ticker.highest_bid),
        ask: parseToFloat(ticker.lowest_ask),
        baseVolume: parseToFloat(ticker.quote_volume), // reversed
        quoteVolume: parseToFloat(ticker.base_volume),
      });
    });
  }
}

module.exports = Mintme;
