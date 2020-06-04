const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

/**
 * @memberof Driver
 * @augments Driver
 */
class Tidex extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const { pairs } = await request('https://api.tidex.com/api/3/info');
    const markets = Object.keys(pairs);
    const tickers = await request(`https://api.tidex.com/api/3/ticker/${markets.join('-')}`);

    return markets.map((market) => {
      const [base, quote] = market.split('_');
      const ticker = tickers[market];

      return new Ticker({
        base,
        quote,
        quoteVolume: parseToFloat(ticker.vol),
        baseVolume: parseToFloat(ticker.vol_cur),
        close: parseToFloat(ticker.last),
        high: parseToFloat(ticker.high),
        low: parseToFloat(ticker.low),
        vwap: parseToFloat(ticker.avg),
      });
    });
  }
}

module.exports = Tidex;
