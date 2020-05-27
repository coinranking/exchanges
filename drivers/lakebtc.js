const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

/**
 * @memberof Driver
 * @augments Driver
 */
class Lakebtc extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const tickers = await request('https://api.lakebtc.com/api_v2/ticker');
    const markets = Object.keys(tickers);

    return markets.map((market) => {
      const pairs = /^([a-z]*)(usd|eur|jpy|gbp|aud|cad|btc|eth|chf|ngn|sgd|hkd|nzd)$/.exec(market);
      if (!pairs) return undefined;
      const [, base, quote] = pairs;

      const ticker = tickers[market];

      return new Ticker({
        base,
        quote,
        baseVolume: parseToFloat(ticker.volume),
        high: parseToFloat(ticker.high),
        low: parseToFloat(ticker.low),
        close: parseToFloat(ticker.last),
      });
    });
  }
}

module.exports = Lakebtc;
