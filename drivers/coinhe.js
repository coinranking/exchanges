const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils');

/**
 * @memberof Driver
 * @augments Driver
 */
class Coinhe extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const pairs = await request('https://api.coinhe.io/v1/market-summary');

    return pairs.map((pair) => {
      const [key] = Object.keys(pair);
      // Warning: Coinhe inverts base and quote
      const [quote, base] = key.split('_');
      const ticker = pair[key];

      return new Ticker({
        base,
        quote,
        high: parseToFloat(ticker.high24h),
        low: parseToFloat(ticker.low24h),
        close: parseToFloat(ticker.LastPrice),
        bid: parseToFloat(ticker.highestBid),
        ask: parseToFloat(ticker.lowestAsk),
        baseVolume: parseToFloat(ticker.quoteVolume24h),
        quoteVolume: parseToFloat(ticker.baseVolume24h),
      });
    });
  }
}

module.exports = Coinhe;
