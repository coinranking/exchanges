const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

/**
 * @memberof Driver
 * @augments Driver
 */
class Ethermium extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const tickers = await request('https://api.ethermium.com/v1/tokenTickers');

    return tickers.map(
      (ticker) => new Ticker({
        base: ticker.baseSymbol,
        baseReference: ticker.baseAddress,
        quote: ticker.quoteSymbol,
        quoteReference: ticker.quoteAddress,
        high: parseToFloat(ticker.highestBid),
        ask: parseToFloat(ticker.lowestAsk),
        close: parseToFloat(ticker.last),
        baseVolume: parseToFloat(ticker.baseVolume),
        quoteVolume: parseToFloat(ticker.quoteVolume),
      }),
    );
  }
}

module.exports = Ethermium;
