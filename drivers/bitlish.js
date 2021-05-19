const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils');

/**
 * @memberof Driver
 * @augments Driver
 */
class Bitlish extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const tickers = await request('https://bitlish.com/api/v1/tickers');
    const markets = Object.keys(tickers);

    return markets.map((market) => {
      const [, base, quote] = /^(.{3})(.{3})$/.exec(market);
      const ticker = tickers[market];

      return new Ticker({
        base,
        quote,
        baseVolume: parseToFloat(ticker.sum),
        close: parseToFloat(ticker.last),
        open: parseToFloat(ticker.first),
        high: parseToFloat(ticker.max),
        low: parseToFloat(ticker.min),
      });
    });
  }
}

module.exports = Bitlish;
