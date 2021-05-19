const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils');

/**
 * @memberof Driver
 * @augments Driver
 */
class Saturn extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const markets = await request('https://ticker.saturn.network/returnTicker.json');

    return Object.keys(markets).map((market) => {
      const [quote, baseReference] = market.split('_');
      const ticker = markets[market];

      return new Ticker({
        base: ticker.symbol,
        baseReference,
        baseName: ticker.name,
        quote,
        close: parseToFloat(ticker.last),
        baseVolume: parseToFloat(ticker.quoteVolume), // reversed with quote
        quoteVolume: parseToFloat(ticker.baseVolume),
      });
    });
  }
}

module.exports = Saturn;
