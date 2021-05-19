const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils');

/**
 * @memberof Driver
 * @augments Driver
 */
class Kkex extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const { tickers: data } = await request('https://kkex.com/api/v1/tickers');
    // KKEX has an array of objects with an object inside that. Weird.
    const tickers = data.map((item) => {
      const [market] = Object.keys(item);
      const ticker = item[market];

      return {
        market,
        ...ticker,
      };
    });

    return tickers.map((ticker) => {
      const pairs = /^([A-Z]*)(BTC|ETH)$/.exec(ticker.market);
      if (!pairs) return undefined;
      const [, base, quote] = pairs;

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

module.exports = Kkex;
