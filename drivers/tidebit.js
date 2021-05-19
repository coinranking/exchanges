const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils');

/**
 * @memberof Driver
 * @augments Driver
 */
class Tidebit extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const tickers = await request('https://www.tidebit.com/api/v2/tickers.json');
    const markets = Object.keys(tickers);

    return markets.map((market) => {
      const pairs = /^([a-z]*)(hkd|usd|eth|hkx|usx)$/.exec(market);
      if (!pairs) return undefined;
      const [, base, quote] = pairs;

      const { ticker } = tickers[market];

      return new Ticker({
        base,
        quote,
        baseVolume: parseToFloat(ticker.vol),
        open: parseToFloat(ticker.open),
        high: parseToFloat(ticker.high),
        low: parseToFloat(ticker.low),
        close: parseToFloat(ticker.last),
      });
    });
  }
}

module.exports = Tidebit;
