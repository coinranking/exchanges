const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils');

/**
 * @memberof Driver
 * @augments Driver
 */
class Bw extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const markets = await request('https://api.bw6.com/data/v1/markets');
    const tickers = await request('https://api.bw6.com/data/v1/allTicker');
    const pairs = Object.keys(markets);

    return pairs.map((pair) => {
      const [base, quote] = pair.split('_');
      const ticker = tickers[pair.replace('_', '')];

      if (!ticker) return undefined;

      return new Ticker({
        base,
        quote,
        quoteVolume: parseToFloat(ticker.turnover),
        baseVolume: parseToFloat(ticker.vol),
        close: parseToFloat(ticker.last),
        open: parseToFloat(ticker.open),
        high: parseToFloat(ticker.high),
        low: parseToFloat(ticker.low),
      });
    });
  }
}

module.exports = Bw;
