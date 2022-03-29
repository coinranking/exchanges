const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils');

/**
 * @memberof Driver
 * @augments Driver
 */
class Osmosis extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const { data: tickers } = await request('https://api-osmosis.imperator.co/pairs/v1/summary');

    // Warning: Osmosis inverts base and quote.
    return tickers.flatMap((ticker) => new Ticker({
      base: ticker.quote_symbol,
      baseName: ticker.quote_name || undefined,
      baseReference: ticker.quote_address,
      quote: ticker.base_symbol,
      quoteName: ticker.base_name || undefined,
      quoteReference: ticker.base_address,
      close: parseToFloat(ticker.price),
      baseVolume: parseToFloat(ticker.quote_volume_24h),
      quoteVolume: parseToFloat(ticker.base_volume_24h),
    }));
  }
}

module.exports = Osmosis;
