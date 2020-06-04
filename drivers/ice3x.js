const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

/**
 * @memberof Driver
 * @augments Driver
 */
class Ice3x extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const { response } = await request('https://ice3x.com/api/v1/stats/marketdepthfull');
    const { entities: tickers } = response;

    return tickers.map((ticker) => {
      const [base, quote] = ticker.pair_name.split('/');

      return new Ticker({
        base,
        quote,
        baseVolume: parseToFloat(ticker.vol),
        high: parseToFloat(ticker.max),
        low: parseToFloat(ticker.min),
        close: parseToFloat(ticker.last_price),
      });
    });
  }
}

module.exports = Ice3x;
