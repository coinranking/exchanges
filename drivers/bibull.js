const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils');

/**
 * @memberof Driver
 * @augments Driver
 */
class Bibull extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const { data: symbols } = await request('https://openapi.hiex.pro/open/api/common/symbols');
    const { data } = await request('https://openapi.hiex.pro/open/api/get_allticker');
    const tickers = data.ticker;
    const pairs = {};

    symbols.forEach((el) => {
      pairs[el.symbol] = {
        base: el.base_coin,
        quote: el.count_coin,
      };
    });

    return tickers.map((ticker) => {
      const { base, quote } = pairs[ticker.symbol];

      return new Ticker({
        base,
        quote,
        high: parseToFloat(ticker.high),
        low: parseToFloat(ticker.low),
        close: parseToFloat(ticker.last),
        bid: parseToFloat(ticker.buy),
        ask: parseToFloat(ticker.sell),
        baseVolume: parseToFloat(ticker.vol),
      });
    });
  }
}

module.exports = Bibull;
