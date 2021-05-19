const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils');

/**
 * @memberof Driver
 * @augments Driver
 */
class Stex extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const { data: tickers } = await request('https://api3.stex.com/public/ticker');

    return tickers.map((ticker) => new Ticker({
      base: ticker.currency_code,
      baseName: ticker.currency_name,
      quote: ticker.market_code,
      quoteName: ticker.market_name,
      high: parseToFloat(ticker.high),
      low: parseToFloat(ticker.low),
      close: parseToFloat(ticker.last),
      open: parseToFloat(ticker.open),
      bid: parseToFloat(ticker.bid),
      ask: parseToFloat(ticker.ask),
      baseVolume: parseToFloat(ticker.volumeQuote), // reversed with volume qoute
      quoteVolume: parseToFloat(ticker.volume),
    }));
  }
}

module.exports = Stex;
