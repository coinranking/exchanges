const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

/**
 * @memberof Driver
 * @augments Driver
 */
class Remitano extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const tickers = await request('https://remitano.com/api/v1/volumes/market_summaries');
    const markets = Object.keys(tickers);

    return markets.map((market) => {
      const ticker = tickers[market];
      const base = ticker.currency1;
      const quote = ticker.currency2;

      return new Ticker({
        base,
        quote,
        baseVolume: parseToFloat(ticker.volume24h),
        close: parseToFloat(ticker.last),
        high: parseToFloat(ticker.high_price),
        low: parseToFloat(ticker.low_price),
      });
    });
  }
}

module.exports = Remitano;
