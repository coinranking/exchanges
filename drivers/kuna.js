const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils');

/**
 * @memberof Driver
 * @augments Driver
 */
class Kuna extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const tickers = await request('https://kuna.io/api/v2/tickers');
    const markets = Object.keys(tickers);

    return markets.map((market) => {
      const pairs = /^([a-z]*)(uah|btc|usdt|rub)$/.exec(market);
      if (!pairs) return undefined;
      const [, base, quote] = pairs;

      const { ticker } = tickers[market];

      return new Ticker({
        base,
        quote,
        baseVolume: parseToFloat(ticker.vol),
        open: parseToFloat(ticker.openPrice),
        high: parseToFloat(ticker.high),
        low: parseToFloat(ticker.low),
        close: parseToFloat(ticker.last),
      });
    });
  }
}

module.exports = Kuna;
