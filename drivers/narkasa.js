const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils');

/**
 * @memberof Driver
 * @augments Driver
 */
class Narkasa extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const { markets: tickers } = await request('https://api.narkasa.com/v3/api/market/markets');

    return tickers.map((ticker) => new Ticker({
      base: ticker.firstSymbol,
      baseName: ticker.name,
      quote: ticker.secondSymbol,
      high: parseToFloat(ticker.high),
      low: parseToFloat(ticker.low),
      close: parseToFloat(ticker.last),
      open: parseToFloat(ticker.open),
      bid: parseToFloat(ticker.firstBid),
      ask: parseToFloat(ticker.firstAsk),
      baseVolume: parseToFloat(ticker.volumeQty), // base and quote volumes are reversed
      quoteVolume: parseToFloat(ticker.volume),
    }));
  }
}

module.exports = Narkasa;
