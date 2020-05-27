const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

/**
 * @memberof Driver
 * @augments Driver
 */
class Blockchain extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const { symbols } = await request('https://api.blockchain.io/v1/exchangeInfo');
    const tickers = await request('https://api.blockchain.io/v1/ticker/24hr');

    return tickers.map((ticker) => {
      const record = symbols.find((item) => item.symbol === ticker.symbol);
      if (!record) return undefined;

      // they reversed base with quote
      return new Ticker({
        base: record.baseAsset,
        quote: record.quoteAsset,
        high: parseToFloat(ticker.highPrice),
        low: parseToFloat(ticker.lowPrice),
        close: parseToFloat(ticker.lastPrice),
        bid: parseToFloat(ticker.bidPrice),
        aks: parseToFloat(ticker.askPrice),
        quoteVolume: parseToFloat(ticker.quoteVolume),
        baseVolume: parseToFloat(ticker.volume),
      });
    });
  }
}

module.exports = Blockchain;
