const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils');

/**
 * @memberof Driver
 * @augments Driver
 */
class Bitubu extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const { message: tickers } = await request('https://api.bitubu.com/api/v2/market/tickers');

    return tickers
      .filter((ticker) => ticker.instType === 'SPOT')
      .map((ticker) => {
        const [base, quote] = ticker.instId.split('-');

        return new Ticker({
          base,
          quote,
          quoteVolume: parseToFloat(ticker.volCcy24h),
          baseVolume: parseToFloat(ticker.vol24h),
          open: parseToFloat(ticker.open24h),
          high: parseToFloat(ticker.high24h),
          low: parseToFloat(ticker.low24h),
          close: parseToFloat(ticker.last),
        });
      });
  }
}

module.exports = Bitubu;
