const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils');

/**
 * @memberof Driver
 * @augments Driver
 */
class Bitkub extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const tickers = await request('https://api.bitkub.com/api/market/ticker');
    const markets = Object.keys(tickers);

    return markets
      .filter((market) => market.isFrozen !== 0)
      .map((market) => {
      // Warning: Bitkub inverts base and quote only in the pair
        const [quote, base] = market.split('_');
        const ticker = tickers[market];

        return new Ticker({
          base,
          quote,
          quoteVolume: parseToFloat(ticker.quoteVolume),
          baseVolume: parseToFloat(ticker.baseVolume),
          close: parseToFloat(ticker.last),
          high: parseToFloat(ticker.high24hr),
          low: parseToFloat(ticker.low24hr),
        });
      });
  }
}

module.exports = Bitkub;
