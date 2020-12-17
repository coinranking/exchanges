const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

/**
 * @memberof Driver
 * @augments Driver
 */
class Beaxy extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const markets = await request('https://services.beaxy.com/api/v2/symbols/rates');
    const symbols = await request('https://services.beaxy.com/api/v2/symbols');
    const pairs = {};

    symbols.forEach((symbol) => {
      pairs[symbol.name] = {
        base: symbol.baseCurrency,
        quote: symbol.termCurrency,
      };
    });

    return Object.keys(markets).map((marketName) => {
      const ticker = markets[marketName];
      const { base, quote } = pairs[marketName];

      return new Ticker({
        base,
        quote,
        high: parseToFloat(ticker.high24h),
        low: parseToFloat(ticker.low24h),
        close: parseToFloat(ticker.price),
        bid: parseToFloat(ticker.bid),
        ask: parseToFloat(ticker.ask),
        baseVolume: parseToFloat(ticker.volume24),
      });
    });
  }
}

module.exports = Beaxy;
