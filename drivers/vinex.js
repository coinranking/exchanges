const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils');

/**
 * @memberof Driver
 * @augments Driver
 */
class Vinex extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const { data: tickers } = await request('https://api.vinex.network/api/v2/markets');

    return tickers.map((ticker) => {
    // Warning: base and quote are switched!
      const [quote, base] = ticker.symbol.split('_');

      return new Ticker({
        base,
        baseName: ticker.tokenInfo2.name,
        quote,
        quoteName: ticker.tokenInfo1.name,
        high: parseToFloat(ticker.high24h),
        low: parseToFloat(ticker.low24h),
        close: parseToFloat(ticker.lastPrice),
        baseVolume: parseToFloat(ticker.asset2Volume24h),
        quoteVolume: parseToFloat(ticker.volume24h),
      });
    });
  }
}

module.exports = Vinex;
