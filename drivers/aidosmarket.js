const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils');

/**
 * @memberof Driver
 * @augments Driver
 */
class Aidosmarket extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const { stats: ticker } = await request('https://aidosmarket.com/api/stats');

    const base = 'ADK';
    const quote = 'BTC';

    return [new Ticker({
      base,
      quote,
      quoteVolume: parseToFloat(ticker['24h_volume']),
      close: parseToFloat(ticker.last_price),
    })];
  }
}

module.exports = Aidosmarket;
