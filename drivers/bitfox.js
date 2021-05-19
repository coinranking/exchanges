const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils');

/**
 * @memberof Driver
 * @augments Driver
 */
class Bitfox extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const tickers = await request('https://api.bitfox.in/open/tickers');

    return tickers.map((ticker) => {
      const [base, quote] = ticker.productId.split('-');

      return new Ticker({
        base,
        quote,
        high: parseToFloat(ticker.high24h),
        low: parseToFloat(ticker.low24h),
        close: parseToFloat(ticker.price),
        open: parseToFloat(ticker.open24h),
        baseVolume: parseToFloat(ticker.volume24h),
        quoteVolume: parseToFloat(ticker.amount24h),
      });
    });
  }
}

module.exports = Bitfox;
