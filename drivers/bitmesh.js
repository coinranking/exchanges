const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils');

/**
 * @memberof Driver
 * @augments Driver
 */
class Bitmesh extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const { data } = await request('https://api.bitmesh.com/?api=market.ticker');
    const tickers = Object.values(data);

    return tickers.map((ticker) => {
    // Bitmesh inverts the base and quote!
      const [quote, base] = ticker.name.split('_');

      return new Ticker({
        base,
        quote,
        quoteVolume: parseToFloat(ticker.value),
        baseVolume: parseToFloat(ticker.volume),
        close: parseToFloat(ticker.price),
        high: parseToFloat(ticker.max),
        low: parseToFloat(ticker.min),
      });
    });
  }
}

module.exports = Bitmesh;
