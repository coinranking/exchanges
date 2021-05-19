const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils');

/**
 * @memberof Driver
 * @augments Driver
 */
class Cashpayz extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const { Data: tickers } = await request('https://cashpayz.exchange/public/ticker');
    const markets = Object.keys(tickers);

    return markets.map((market) => {
    // Warning: Cashpayz inverts base and quote
      const [quote, base] = market.split('_');
      const ticker = tickers[market];

      return new Ticker({
        base,
        quote,
        baseVolume: parseToFloat(ticker.quoteVolume),
        quoteVolume: parseToFloat(ticker.baseVolume),
        high: parseToFloat(ticker.high24hr),
        low: parseToFloat(ticker.low24hr),
        close: parseToFloat(ticker.last),
      });
    });
  }
}

module.exports = Cashpayz;
