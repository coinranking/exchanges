const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

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
    const tickers = await request('https://www.okcoin.com/api/spot/v3/instruments/ticker');

    return tickers.map((ticker) => {
      const [base, quote] = ticker.product_id.split('-');

      return new Ticker({
        base,
        quote,
        quoteVolume: parseToFloat(ticker.quote_volume_24h),
        baseVolume: parseToFloat(ticker.base_volume_24h),
        close: parseToFloat(ticker.last),
        open: parseToFloat(ticker.open_24h),
        high: parseToFloat(ticker.high_24h),
        low: parseToFloat(ticker.low_24h),
      });
    });
  }
}

module.exports = Okcoin;
