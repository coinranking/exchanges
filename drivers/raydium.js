const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils');

/**
 * @memberof Driver
 * @augments Driver
 */
class Raydium extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const tickers = await request('https://api.raydium.io/v2/main/pairs');

    return tickers.flatMap((ticker) => new Ticker({
      // The pair name is unreliable, because they sometimes consist of multiple hyphens and
      // market names are not unique within Raydium
      base: ticker.baseMint,
      quote: ticker.quoteMint,
      baseReference: ticker.baseMint,
      quoteReference: ticker.quoteMint,
      close: parseToFloat(ticker.price),
      baseVolume: parseToFloat(ticker.volume24h),
      quoteVolume: parseToFloat(ticker.volume24hQuote),
    }));
  }
}

module.exports = Raydium;
