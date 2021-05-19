const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat, throttleMap } = require('../lib/utils');

/**
 * @memberof Driver
 * @augments Driver
 */
class Btcmarkets extends Driver {
  /**
   * @param {boolean} isMocked Set to true when stored tickers are used
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers(isMocked) {
    const { markets } = await request('https://api.btcmarkets.net/v2/market/active');

    const tickers = throttleMap(markets, async (market) => {
      const base = market.instrument;
      const quote = market.currency;

      const ticker = await request(`https://api.btcmarkets.net/market/${base}/${quote}/tick`);

      return new Ticker({
        base,
        quote,
        baseVolume: parseToFloat(ticker.volume24h),
        high: parseToFloat(ticker.high24h),
        low: parseToFloat(ticker.low24h),
        close: parseToFloat(ticker.lastPrice),
      });
    }, isMocked ? 0 : 50); // Limited to 20 requests a second

    return Promise.all(tickers);
  }
}

module.exports = Btcmarkets;
