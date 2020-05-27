const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

/**
 * @memberof Driver
 * @augments Driver
 */
class Yoobtc extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const { data: markets } = await request('https://api.yoobtc.com/api/v1/tickers');

    return Object.keys(markets).map((market) => {
      const [base, quote] = market.split('/');
      const ticker = markets[market];

      return new Ticker({
        base,
        quote,
        high: parseToFloat(ticker.high),
        low: parseToFloat(ticker.low),
        close: parseToFloat(ticker.last),
        baseVolume: parseToFloat(ticker.vol),
      });
    });
  }
}

module.exports = Yoobtc;
