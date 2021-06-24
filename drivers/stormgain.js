const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils');

/**
 * @memberof Driver
 * @augments Driver
 */
class Stormgain extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const tickers = await request('https://public-api.stormgain.com/api/v1/cg/spot/tickers');

    return tickers.map((ticker) => new Ticker({
      base: ticker.base_currency,
      quote: ticker.target_currency,
      high: parseToFloat(ticker.high),
      low: parseToFloat(ticker.low),
      close: parseToFloat(ticker.last_price),
      bid: parseToFloat(ticker.bid),
      ask: parseToFloat(ticker.ask),
      baseVolume: parseToFloat(ticker.base_volume),
      quoteVolume: parseToFloat(ticker.target_volume),
    }));
  }
}

module.exports = Stormgain;
