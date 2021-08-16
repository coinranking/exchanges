const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils');

/**
 * @memberof Driver
 * @augments Driver
 */
class Cryptex extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const { data } = await request('https://cryptex.net/api/v1/tickers');
    const tickers = Object.values(data);
    return tickers.map((ticker) => new Ticker({
      base: ticker.base,
      quote: ticker.quote,
      quoteVolume: parseToFloat(ticker.value),
      baseVolume: parseToFloat(ticker.volume),
      close: parseToFloat(ticker.last),
      high: parseToFloat(ticker.high),
      low: parseToFloat(ticker.low),
    }));
  }
}

module.exports = Cryptex;
