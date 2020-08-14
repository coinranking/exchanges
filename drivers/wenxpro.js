const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

/**
 * @memberof Driver
 * @augments Driver
 */
class Wenxpro extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const tickers = await request('https://api.wenxpro.com/openapi/quote/v1/ticker/24hr');
    const { symbols } = await request('https://api.wenxpro.com/openapi/v1/brokerInfo');
    const pairs = {};

    symbols.forEach((el) => {
      pairs[el.symbolName] = {
        base: el.baseAsset,
        baseName: el.baseAssetName,
        quote: el.quoteAsset,
        quoteName: el.quoteAssetName,
      };
    });

    return tickers.map((ticker) => {
      const {
        base, quote, baseName, quoteName,
      } = pairs[ticker.symbol];

      return new Ticker({
        base,
        baseName,
        quote,
        quoteName,
        high: parseToFloat(ticker.highPrice),
        low: parseToFloat(ticker.lowPrice),
        close: parseToFloat(ticker.lastPrice),
        open: parseToFloat(ticker.openPrice),
        baseVolume: parseToFloat(ticker.volume),
        quoteVolume: parseToFloat(ticker.quoteVolume),
      });
    });
  }
}

module.exports = Wenxpro;
