const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils');

/**
 * @memberof Driver
 * @augments Driver
 */
class Tokenstore extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const data = await request('https://v1-1.api.token.store/ticker');
    const markets = Object.keys(data);

    return markets.map((market) => {
    // Warning: TokenStore inverts base and quote
      const [quote, base] = market.split('_');
      const ticker = data[market];
      if (!ticker) return undefined;

      return new Ticker({
        base,
        quote,
        baseVolume: parseToFloat(ticker.quoteVolume),
        quoteVolume: parseToFloat(ticker.baseVolume),
        close: parseToFloat(ticker.last),
      });
    });
  }
}

module.exports = Tokenstore;
