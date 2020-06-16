const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

/**
 * @memberof Driver
 * @augments Driver
 */
class Paycml extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const pairs = await request('https://paycml.com/tickerapi');

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
        baseVolume: parseToFloat(ticker.quoteVolume), // reversed with quote volume
        quoteVolume: parseToFloat(ticker.baseVolume),
      });
    });
  }
}

module.exports = Paycml;
