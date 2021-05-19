const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils');

/**
 * @memberof Driver
 * @augments Driver
 */
class Zloadr extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const data = await request('https://www.zloadr.com/zapi/ticker');
    const markets = Object.keys(data);

    return markets.map((market) => {
      const [base, quote] = market.split('_');
      const [ticker] = data[market];

      return new Ticker({
        base,
        quote,
        quoteVolume: parseToFloat(ticker['24h_volume']),
        high: parseToFloat(ticker['24h_high']),
        low: parseToFloat(ticker['24h_low']),
        close: parseToFloat(ticker.last_done),
      });
    });
  }
}

module.exports = Zloadr;
