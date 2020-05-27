const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { throttleMap, parseToFloat } = require('../lib/utils');

/**
 * @memberof Driver
 * @augments Driver
 */
class Surface extends Driver {
  /**
   * @param {boolean} isMocked Set to true when stored tickers are used
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers(isMocked) {
    const markets = await request('https://www.surfacexchanges.com/api/v2/peatio/public/markets');

    const tickers = throttleMap(markets, async (market) => {
      const pair = market.id;
      const [base, quote] = market.name.split('/');
      const { ticker } = await request(`https://www.surfacexchanges.com/api/v2/peatio/public/markets/${pair}/tickers`);

      return new Ticker({
        base,
        quote,
        high: parseToFloat(ticker.high),
        low: parseToFloat(ticker.low),
        close: parseToFloat(ticker.last),
        bid: parseToFloat(market.buy),
        ask: parseToFloat(market.sell),
        baseVolume: parseToFloat(ticker.volume),
      });
    }, isMocked ? 0 : 50); // 20 requests per second

    return Promise.all(tickers);
  }
}

module.exports = Surface;
