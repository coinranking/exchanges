const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils');

/**
 * @memberof Driver
 * @augments Driver
 */
class Paribu extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const pairs = await request('https://www.paribu.com/ticker');

    return Object.keys(pairs).map((pair) => {
      const ticker = pairs[pair];
      const [base, quote] = pair.split('_');

      return new Ticker({
        base,
        quote,
        high: parseToFloat(ticker.high24hr),
        low: parseToFloat(ticker.low24hr),
        close: parseToFloat(ticker.last),
        bid: parseToFloat(ticker.highestBid),
        ask: parseToFloat(ticker.lowestAsk),
        baseVolume: parseToFloat(ticker.volume),
      });
    });
  }
}

module.exports = Paribu;
