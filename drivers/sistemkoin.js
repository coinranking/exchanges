const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { flatMap, parseToFloat } = require('../lib/utils');

/**
 * @memberof Driver
 * @augments Driver
 */
class Sistemkoin extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const data = await request('https://api.sistemkoin.com/ticker');
    const quotes = Object.keys(data);

    return flatMap(quotes, (quote) => {
      const tickers = Object.values(data[quote]);

      return tickers.map((ticker) => {
        const base = ticker.symbol;

        return new Ticker({
          base,
          quote,
          quoteVolume: parseToFloat(ticker.volume),
          close: parseToFloat(ticker.current),
          high: parseToFloat(ticker.high),
          low: parseToFloat(ticker.low),
        });
      });
    });
  }
}

module.exports = Sistemkoin;
