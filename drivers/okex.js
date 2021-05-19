const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils');

/**
 * @memberof Driver
 * @augments Driver
 */
class Okex extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const tickers = await request('https://www.okex.com/api/spot/v3/instruments/ticker');

    return tickers.map((ticker) => {
      const [base, quote] = ticker.product_id.split('-');

      return new Ticker({
        base,
        quote,
        baseVolume: parseToFloat(ticker.base_volume_24h),
        quoteVolume: parseToFloat(ticker.quote_volume_24h),
        open: parseToFloat(ticker.open_24h),
        high: parseToFloat(ticker.high_24h),
        low: parseToFloat(ticker.low_24h),
        close: parseToFloat(ticker.last),
      });
    });
  }
}

module.exports = Okex;
