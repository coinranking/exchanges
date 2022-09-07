const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils');

/**
 * @memberof Driver
 * @augments Driver
 */
class Xeggex extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const data = await request('https://xeggex.com/api/v2/tickers');
    // Return the data mapped to instances of the Ticker model, the exact way will differ for every
    // exchange.
    return data.map((item) => new Ticker({
      base: item.base_currency,
      quote: item.target_currency,
      quoteVolume: parseToFloat(item.target_volume),
      baseVolume: parseToFloat(item.base_volume),
      close: parseToFloat(item.last_price),
      high: parseToFloat(item.high),
      low: parseToFloat(item.low),
      ask: parseToFloat(item.ask),
      bid: parseToFloat(item.bid),
    }));
  }
}

module.exports = Xeggex;
