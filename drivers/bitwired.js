/* eslint-disable camelcase */
const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils');

/**
 * @memberof Driver
 * @augments Driver
 */
class Bitwired extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const { data: symbols } = await request('https://api.bitwired.com/sapi/v1/market/symbols');
    const { data: tickers } = await request('https://api.bitwired.com/sapi/v1/market/mini-ticker');
    const pairs = {};

    symbols.forEach(({
      symbol, base_asset, quote_asset, price_precision,
    }) => {
      pairs[symbol] = {
        base: base_asset,
        quote: quote_asset,
        price_precision,
      };
    });

    return tickers.map((ticker) => {
      const { base, quote } = pairs[ticker.s];

      return new Ticker({
        base,
        quote,
        high: parseToFloat(ticker.h),
        low: parseToFloat(ticker.l),
        open: parseToFloat(ticker.o),
        close: parseToFloat(ticker.c),
        quoteVolume: parseToFloat(ticker.q),
        baseVolume: parseToFloat(ticker.v),
      });
    });
  }
}

module.exports = Bitwired;
