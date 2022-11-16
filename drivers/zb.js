const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils');

/**
 * @memberof Driver
 * @augments Driver
 */
class Zb extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const data = await request('http://api.zb.com/data/v1/markets');
    const markets = Object.keys(data);
    const tickers = await request('http://api.zb.com/data/v1/allTicker');

    return markets.map((market) => {
      const [base, quote] = market.split('_');

      const ticker = tickers[`${base}${quote}`];
      if (!ticker) return undefined;

      return new Ticker({
        base,
        quote,
        close: parseToFloat(ticker.last),
        baseVolume: parseToFloat(ticker.vol),
        high: parseToFloat(ticker.high),
        low: parseToFloat(ticker.low),
      });
    });
  }
}

module.exports = Zb;
