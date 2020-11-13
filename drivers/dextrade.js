const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils');

/**
 * @memberof Driver
 * @augments Driver
 */
class Dextrade extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const { data: symbols } = await request('https://api.dex-trade.com/v1/public/symbols');
    const { data: tickers } = await request('https://api.dex-trade.com/v1/public/tickers');
    const pairs = {};

    symbols.forEach((el) => {
      pairs[el.pair] = {
        base: el.base,
        quote: el.quote,
      };
    });

    return tickers.map((ticker) => {
      if (!pairs[ticker.pair]) {
        return undefined;
      }

      const { base, quote } = pairs[ticker.pair];

      return new Ticker({
        base,
        quote,
        high: parseToFloat(ticker.high),
        low: parseToFloat(ticker.low),
        close: parseToFloat(ticker.last),
        open: parseToFloat(ticker.open),
        baseVolume: parseToFloat(ticker.volume_24H),
      });
    });
  }
}

module.exports = Dextrade;
