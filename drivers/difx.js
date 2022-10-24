const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils');

/**
 * @memberof Driver
 * @augments Driver
 */
class Difx extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const tickers = await request('https://api-v2.difx.com/open/api/v1/summary');
    const assets = await request('https://api-v2.difx.com/open/api/v1/assets');

    return tickers.map((ticker) => {
      const baseName = assets[ticker.base_currency]?.name;
      const quoteName = assets[ticker.quote_currency]?.name;

      return new Ticker({
        base: ticker.base_currency,
        baseName,
        quote: ticker.quote_currency,
        quoteName,
        high: parseToFloat(ticker.highest_price_24h),
        low: parseToFloat(ticker.lowest_price_24h),
        close: parseToFloat(ticker.last_price),
        bid: parseToFloat(ticker.highest_bid),
        ask: parseToFloat(ticker.lowest_ask),
        baseVolume: parseToFloat(ticker.base_volume),
        quoteVolume: parseToFloat(ticker.quote_volume),
      });
    });
  }
}

module.exports = Difx;
