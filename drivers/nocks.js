const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils');

/**
 * @memberof Driver
 * @augments Driver
 */
class Nocks extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const { data: tickers } = await request('https://api.nocks.com/api/v2/trade-market');

    return tickers
      .filter((ticker) => (ticker.is_active === true))
      .map((ticker) => {
        const [base, quote] = ticker.code.split('-');

        return new Ticker({
          base,
          quote,
          quoteVolume: parseToFloat(ticker.volume.amount),
          close: parseToFloat(ticker.last.amount),
          high: parseToFloat(ticker.high.amount),
          low: parseToFloat(ticker.low.amount),
        });
      });
  }
}

module.exports = Nocks;
