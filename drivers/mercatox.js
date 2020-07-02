const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

/**
 * @memberof Driver
 * @augments Driver
 */
class Mercatox extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const { pairs } = await request('https://mercatox.com/public/json24full');
    const markets = Object.keys(pairs);

    return markets.map((market) => {
      const [base, quote] = market.split('_');

      if (base === '') return undefined;
      if (quote === '') return undefined;

      const ticker = pairs[market];

      return new Ticker({
        base,
        quote,
        baseVolume: parseToFloat(ticker.baseVolume),
        quoteVolume: parseToFloat(ticker.quoteVolume),
        high: parseToFloat(ticker.high24hr),
        low: parseToFloat(ticker.low24hr),
        close: parseToFloat(ticker.last),
      });
    });
  }
}

module.exports = Mercatox;
