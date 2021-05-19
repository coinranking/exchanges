const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils');

/**
 * @memberof Driver
 * @augments Driver
 */
class Ankerswap extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
  // get base and quote data for tickers
    const { data: tickers } = await request('https://api.ankerswap.com/api/v1/tickers');

    return tickers.map((ticker) => new Ticker({
      base: ticker.base_currency,
      quote: ticker.target_currency,
      high: parseToFloat(ticker.high),
      low: parseToFloat(ticker.low),
      close: parseToFloat(ticker.last_price),
      baseVolume: parseToFloat(ticker.base_volume),
      quoteVolume: parseToFloat(ticker.target_volume),
    }));
  }
}

module.exports = Ankerswap;
