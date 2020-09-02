const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

/**
 * @memberof Driver
 * @augments Driver
 */
class Beldex extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const { result: symbols } = await request('https://api.beldex.io/api/v1/market/list');
    const { result: markets } = await request('https://api.beldex.io/api/v1/market/summary');
    const pairs = {};

    symbols.forEach((el) => {
      pairs[el.name] = {
        base: el.stock,
        quote: el.money,
      };
    });

    return Object.keys(markets).map((market) => {
      const { base, quote } = pairs[market];
      const ticker = markets[market];

      if (!ticker) {
        return undefined;
      }

      return new Ticker({
        base,
        quote,
        high: parseToFloat(ticker.high),
        low: parseToFloat(ticker.low),
        close: parseToFloat(ticker.last),
        open: parseToFloat(ticker.open),
        baseVolume: parseToFloat(ticker.base_volume),
        quoteVolume: parseToFloat(ticker.quote_volume),
      });
    });
  }
}

module.exports = Beldex;
