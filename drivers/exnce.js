const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils');

/**
 * @memberof Driver
 * @augments Driver
 */
class Exnce extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const { data: tickers } = await request('https://exnce.com/api/v1/ticker');

    return tickers.map((ticker) => {
      const [base, quote] = ticker.pair.split('/');

      return new Ticker({
        base,
        quote,
        high: parseToFloat(ticker.high),
        low: parseToFloat(ticker.low),
        close: parseToFloat(ticker.last),
        bid: parseToFloat(ticker.ask), // yes, they reversed ask and bid!
        ask: parseToFloat(ticker.bid),
        quoteVolume: parseToFloat(ticker.volume),
      });
    });
  }
}

module.exports = Exnce;
