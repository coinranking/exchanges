const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils');

/**
 * @memberof Driver
 * @augments Driver
 */
class Whitebit extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const { result: tickers } = await request('https://whitebit.com/api/v2/public/ticker');

    return tickers.map((ticker) => {
      const [base, quote] = ticker.tradingPairs.split('_');

      return new Ticker({
        base,
        quote,
        baseVolume: parseToFloat(ticker.baseVolume24h),
        quoteVolume: parseToFloat(ticker.quoteVolume24h),
        close: parseToFloat(ticker.lastPrice),
      });
    });
  }
}

module.exports = Whitebit;
