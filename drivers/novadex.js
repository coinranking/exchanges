const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils');

/**
 * @memberof Driver
 * @augments Driver
 */
class Novadex extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const { data: tickers } = await request('https://api.novadax.com/v1/market/tickers');

    return tickers.map((ticker) => {
      const [base, quote] = ticker.symbol.split('_');

      return new Ticker({
        base,
        quote,
        high: parseToFloat(ticker.high24h),
        low: parseToFloat(ticker.low24h),
        close: parseToFloat(ticker.lastPrice),
        bid: parseToFloat(ticker.bid),
        ask: parseToFloat(ticker.ask),
        baseVolume: parseToFloat(ticker.baseVolume24h),
        quoteVolume: parseToFloat(ticker.quoteVolume24h),
      });
    });
  }
}

module.exports = Novadex;
