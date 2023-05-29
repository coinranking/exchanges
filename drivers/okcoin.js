const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils');

/**
 * @memberof Driver
 * @augments Driver
 */
class Okcoin extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const { data: tickers } = await request('https://www.okcoin.com/api/v5/market/tickers?instType=SPOT');

    return tickers.map((ticker) => {
      const [base, quote] = ticker.instId.split('-');

      return new Ticker({
        base,
        quote,
        quoteVolume: parseToFloat(ticker.volCcy24h),
        baseVolume: parseToFloat(ticker.vol24h),
        close: parseToFloat(ticker.last),
        open: parseToFloat(ticker.open24h),
        high: parseToFloat(ticker.high24h),
        low: parseToFloat(ticker.low24h),
      });
    });
  }
}

module.exports = Okcoin;
