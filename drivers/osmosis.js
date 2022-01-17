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
    const tokens = await request('https://api-osmosis.imperator.co/tokens/v1/all');

    return tickers.flatMap((ticker) => {
      const base = tokens.find((item) => item.symbol === ticker.base_symbol);
      const quote = tokens.find((item) => item.symbol === ticker.quote_symbol);

      return new Ticker({
        base: ticker.base_symbol,
        baseName: base ? base.name : undefined,
        baseReference: ticker.base_address,
        quote: ticker.quote_symbol,
        quoteName: quote ? quote.name : undefined,
        quoteReference: ticker.quote_address,
        close: parseToFloat(ticker.price),
        baseVolume: parseToFloat(ticker.base_volume_24h),
        quoteVolume: parseToFloat(ticker.quote_volume_24h),
      });
    });
  }
}

module.exports = Osmosis;
