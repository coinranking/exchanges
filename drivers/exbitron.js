const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils');

/**
 * @memberof Driver
 * @augments Driver
 */
class Exbitron extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const tickers = await request('https://www.exbitron.com/api/v2/peatio/coinmarketcap/summary');

    return tickers.map((ticker) => {
      const [base, quote] = ticker.trading_pairs.split('_');

      return new Ticker({
        base,
        quote,
        baseVolume: parseToFloat(ticker.base_volume),
        quoteVolume: parseToFloat(ticker.quote_volume),
        high: parseToFloat(ticker.highest_price_24h),
        low: parseToFloat(ticker.lowest_price_24h),
        close: parseToFloat(ticker.last_price),
      });
    });
  }
}

module.exports = Exbitron;
