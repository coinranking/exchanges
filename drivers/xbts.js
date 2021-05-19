const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils');

/**
 * @memberof Driver
 * @augments Driver
 */
class Xbts extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const data = await request('https://api.xbts.io/api/market24');
    const markets = Object.keys(data);

    return markets.map((market) => {
      const [base, quote] = market.split('_');
      const ticker = data[market];
      if (!ticker) return undefined;

      return new Ticker({
        base,
        quote,
        baseVolume: parseToFloat(ticker.vol_cur),
        quoteVolume: parseToFloat(ticker.vol),
        high: parseToFloat(ticker.high),
        low: parseToFloat(ticker.low),
        close: parseToFloat(ticker.last),
        vwap: parseToFloat(ticker.avg),
      });
    });
  }
}

module.exports = Xbts;
