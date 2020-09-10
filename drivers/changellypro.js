const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils');

/**
 * @memberof Driver
 * @augments Driver
 */
class Changellypro extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const symbols = await request('https://api.pro.changelly.com/api/2/public/symbol');
    const tickers = await request('https://api.pro.changelly.com/api/2/public/ticker');

    const pairs = {};

    symbols.forEach((el) => {
      pairs[el.id] = {
        base: el.baseCurrency,
        quote: el.quoteCurrency,
      };
    });

    return Object.values(tickers).map((ticker) => {
      const { base, quote } = pairs[ticker.symbol];

      return new Ticker({
        base,
        quote,
        high: parseToFloat(ticker.high),
        low: parseToFloat(ticker.low),
        close: parseToFloat(ticker.last),
        open: parseToFloat(ticker.open),
        bid: parseToFloat(ticker.buy),
        ask: parseToFloat(ticker.sell),
        baseVolume: parseToFloat(ticker.volume),
        quoteVolume: parseToFloat(ticker.volumeQuote),
      });
    });
  }
}

module.exports = Changellypro;
