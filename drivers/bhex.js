const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

/**
 * @memberof Driver
 * @augments Driver
 */
class Bhex extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
  // get base and quote data for tickers
    const { symbols: data } = await request('https://www.bhex.com/openapi/v1/brokerInfo');
    const pairs = {};

    data.forEach((el) => {
      pairs[el.symbol] = {
        base: el.baseAsset,
        quote: el.quoteAsset,
      };
    });

    const tickers = await request('https://www.bhex.com/openapi/quote/v1/ticker/24hr');

    return tickers.map((ticker) => {
      const { base, quote } = pairs[ticker.symbol];

      return new Ticker({
        base,
        quote,
        high: parseToFloat(ticker.highPrice),
        low: parseToFloat(ticker.lowPrice),
        close: parseToFloat(ticker.lastPrice),
        baseVolume: parseToFloat(ticker.volume),
        quoteVolume: parseToFloat(ticker.quoteVolume),
      });
    });
  }
}

module.exports = Bhex;
