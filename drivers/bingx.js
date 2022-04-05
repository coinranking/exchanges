const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils');

/**
 * @memberof Driver
 * @augments Driver
 */
class Bingx extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const { data: tickers } = (await request('https://api.bingbon.com/api/v1/market/cmc/spot/summary'));

    return tickers.map((ticker) => new Ticker({
      base: ticker.base_currency,
      quote: ticker.quote_currency,
      baseVolume: parseToFloat(ticker.base_volume),
      quoteVolume: parseToFloat(ticker.quote_volume),
      high: parseToFloat(ticker.highest_price_24h),
      low: parseToFloat(ticker.lowest_price_24h),
      close: parseToFloat(ticker.last_price),
      bid: parseToFloat(ticker.lowest_ask),
      ask: parseToFloat(ticker.highest_ask),
    }));
  }
}

module.exports = Bingx;
