const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils');

/**
 * @memberof Driver
 * @augments Driver
 */
class Lintax extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const markets = await request('https://lin.tax/api/v2/peatio/public/markets/tickers');
    const symbols = await request('https://lin.tax/api/v2/peatio/public/markets');
    const pairs = {};

    symbols.forEach((el) => {
      pairs[el.id] = {
        base: el.base_unit,
        quote: el.quote_unit,
      };
    });

    return Object.keys(markets).map((market) => {
      const { base, quote } = pairs[market];
      const { ticker } = markets[market];

      return new Ticker({
        base,
        quote,
        high: parseToFloat(ticker.high),
        low: parseToFloat(ticker.low),
        close: parseToFloat(ticker.last),
        open: parseToFloat(ticker.open),
        bid: parseToFloat(ticker.sell),
        ask: parseToFloat(ticker.ask),
        baseVolume: parseToFloat(ticker.vol),
      });
    });
  }
}

module.exports = Lintax;
