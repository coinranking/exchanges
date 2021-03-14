const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat, throttleMap } = require('../lib/utils.js');

/**
 * @memberof Driver
 * @augments Driver
 */
class Tokocrypto extends Driver {
  /**
   * @param {boolean} isMocked Set to true when stored tickers are used
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers(isMocked) {
    const { data: { list: markets } } = await request('https://www.tokocrypto.com/open/v1/common/symbols');

    const tickers = throttleMap(markets, async (market) => {
      const base = market.baseAsset;
      const quote = market.quoteAsset;

      const details = await request(`https://api.binance.cc/api/v1/klines?symbol=${base}${quote}&interval=1d`);
      const [, open, high, low, last, baseVolume, , quoteVolume] = details[0];

      return new Ticker({
        base,
        quote,
        high: parseToFloat(high),
        low: parseToFloat(low),
        close: parseToFloat(last),
        open: parseToFloat(open),
        baseVolume: parseToFloat(baseVolume),
        quoteVolume: parseToFloat(quoteVolume),
      });
    }, isMocked ? 0 : 50);

    return Promise.all(tickers);
  }
}

module.exports = Tokocrypto;
