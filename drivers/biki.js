const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils');

/**
 * @memberof Driver
 * @augments Driver
 */
class Biki extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
  // get base and quote data for tickers
    const { data: symbols } = await request('https://openapi.biki.com/open/api/common/symbols');
    const pairs = {};

    symbols.forEach((el) => {
      pairs[el.symbol] = {
        base: el.base_coin,
        quote: el.count_coin,
      };
    });

    const { data } = await request('https://openapi.biki.com/open/api/get_allticker');
    const { ticker: tickers } = data;

    return tickers.map((ticker) => {
      const { base, quote } = pairs[ticker.symbol];

      return new Ticker({
        base,
        quote,
        high: parseToFloat(ticker.high),
        low: parseToFloat(ticker.low),
        close: parseToFloat(ticker.last),
        baseVolume: parseToFloat(ticker.vol),
      });
    });
  }
}

module.exports = Biki;
