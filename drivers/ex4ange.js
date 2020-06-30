const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;

/**
 * @memberof Driver
 * @augments Driver
 */
class Ex4ange extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const tickers = await request({
      url: 'https://ex4ange.org/api.php?token=public&section=core&action=ticker',
      timeout: 30000,
    });

    return tickers.map((ticker) => {
      const [base, quote] = ticker.pair.split('-');

      return new Ticker({
        base,
        quote,
        high: parseToFloat(ticker.high_24h),
        low: parseToFloat(ticker.low_24h),
        close: parseToFloat(ticker.last_done),
        baseVolume: parseToFloat(ticker.volume_24h),
      });
    });
  }
}

module.exports = Ex4ange;
