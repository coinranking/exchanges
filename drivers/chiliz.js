const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils');

/**
 * @memberof Driver
 * @augments Driver
 */
class Chiliz extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const { symbols } = await request('https://api.chiliz.net/openapi/v1/brokerInfo');
    const tickers = await request('https://api.chiliz.net/openapi/quote/v1/ticker/24hr');

    return symbols.map((market) => {
      const base = market.baseAsset;
      const quote = market.quoteAsset;

      const ticker = tickers.find((item) => item.symbol === market.symbol);

      if (!ticker) return undefined;

      return new Ticker({
        base,
        quote,
        quoteVolume: parseToFloat(ticker.quoteVolume),
        baseVolume: parseToFloat(ticker.volume),
        close: parseToFloat(ticker.lastPrice),
        open: parseToFloat(ticker.openPrice),
        high: parseToFloat(ticker.highPrice),
        low: parseToFloat(ticker.lowPrice),
      });
    });
  }
}

module.exports = Chiliz;
