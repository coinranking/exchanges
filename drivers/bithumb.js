const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

/**
 * @memberof Driver
 * @augments Driver
 */
class Bithumb extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const { data: tickers } = await request('https://api.bithumb.com/public/ticker/all');
    const bases = Object.keys(tickers);

    return bases.map((base) => {
      const quote = 'KRW';
      const ticker = tickers[base];

      return new Ticker({
        base,
        quote,
        quoteVolume: parseToFloat(ticker.acc_trade_value_24H),
        baseVolume: parseToFloat(ticker.units_traded_24H),
        open: parseToFloat(ticker.opening_price),
        high: parseToFloat(ticker.max_price),
        low: parseToFloat(ticker.min_price),
        close: parseToFloat(ticker.closing_price),
      });
    });
  }
}

module.exports = Bithumb;
