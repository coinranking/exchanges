const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

/**
 * @memberof Driver
 * @augments Driver
 */
class Floatsv extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const tickers = await request('https://www.floatsv.com/api/spot/v3/instruments/ticker');

    return tickers.map((ticker) => {
      const [base, quote] = ticker.instrument_id.split('-');

      return new Ticker({
        base,
        quote,
        high: parseToFloat(ticker.high_24hr),
        low: parseToFloat(ticker.low_24hr),
        close: parseToFloat(ticker.last),
        baseVolume: parseToFloat(ticker.base_volume_24h),
        quoteVolume: parseToFloat(ticker.quote_volume_24h),
      });
    });
  }
}

module.exports = Floatsv;
