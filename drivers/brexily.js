const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

/**
 * @memberof Driver
 * @augments Driver
 */
class Brexily extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const { data: tickers } = await request('https://apiexchange.brexily.com:8443/api/v1/tickers');

    return tickers.map((ticker) => new Ticker({
      base: ticker.target_currency,
      quote: ticker.base_currency, // base and quote are reversed
      high: parseToFloat(ticker.high),
      low: parseToFloat(ticker.low),
      close: parseToFloat(ticker.last_price),
      bid: parseToFloat(ticker.bid),
      ask: parseToFloat(ticker.ask),
      baseVolume: parseToFloat(ticker.target_volume),
      quoteVolume: parseToFloat(ticker.base_volume),
    }));
  }
}

module.exports = Brexily;
