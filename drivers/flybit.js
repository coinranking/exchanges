const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { throttleMap, parseToFloat } = require('../lib/utils');
/**
 * @memberof Driver
 * @augments Driver
 */
class Flybit extends Driver {
  /**
   * @param {boolean} isMocked Set to true when stored tickers are used
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers(isMocked) {
    const markets = await request('https://api.flybit.com/v2/public/market/all');

    const tickers = throttleMap(markets, async ({ MARKET: market }) => {
      const ticker = await request(`https://api.flybit.com/v2/public/ticker?market=${market}`);
      const [quote, base] = market.split('-');

      if (!ticker) {
        return undefined;
      }

      return new Ticker({
        base,
        quote,
        high: parseToFloat(ticker.MAX_PRICE),
        low: parseToFloat(ticker.MIN_PRICE),
        close: parseToFloat(ticker.CLOSING_PRICE),
        open: parseToFloat(ticker.OPENING_PRICE),
        baseVolume: parseToFloat(ticker.UNITS_TRADED_24H),
        quoteVolume: parseToFloat(ticker.ACC_TRADE_VALUE_24H),
      });
    }, isMocked ? 0 : 50); // 20 requests per second

    return Promise.all(tickers);
  }
}

module.exports = Flybit;
