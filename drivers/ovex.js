const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils');

/**
 * @memberof Driver
 * @augments Driver
 */
class Ovex extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const pairs = await request('https://www.ovex.io/api/v2/tickers');

    return Object.values(pairs).map((pair) => {
      const { ticker } = pair;
      const base = pair.ask_unit;
      const quote = pair.bid_unit;

      return new Ticker({
        base,
        quote,
        high: parseToFloat(ticker.high),
        low: parseToFloat(ticker.low),
        close: parseToFloat(ticker.last),
        baseVolume: parseToFloat(ticker.volume),
      });
    });
  }
}

module.exports = Ovex;
