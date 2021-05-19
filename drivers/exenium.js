const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils');

/**
 * @memberof Driver
 * @augments Driver
 */
class Exenium extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const { items: tickers } = await request('https://api.exenium.io/trade/pair/listfull');

    return tickers.map((ticker) => {
      const [base, quote] = ticker.currency_codes;

      return new Ticker({
        base,
        quote,
        quoteVolume: parseToFloat(ticker.volume24h),
        close: parseToFloat(ticker.price),
        high: parseToFloat(ticker.high24h),
        low: parseToFloat(ticker.low24h),
      });
    });
  }
}

module.exports = Exenium;
