const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils');

/**
 * @memberof Driver
 * @augments Driver
 */
class Btse extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const data = await request('https://api.btse.com/spot/api/v3.2/market_summary/');

    return data
      .filter((ticker) => ticker.active)
      .map((ticker) => {
        return new Ticker({
          base: ticker.base,
          quote: ticker.quote,
          high: parseToFloat(ticker.high24hr),
          low: parseToFloat(ticker.low24hr),
          close: parseToFloat(ticker.last),
          bid: parseToFloat(ticker.highest_bid),
          ask: parseToFloat(ticker.lowest_ask),
          quoteVolume: parseToFloat(ticker.volume),
        });
      });
  }
}

module.exports = Btse;
