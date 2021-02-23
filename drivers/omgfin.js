const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

/**
 * @memberof Driver
 * @augments Driver
 */
class Omgfin extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const tickers = await request('https://omgfin.com/api/v1/ticker/24hr');

    return tickers.map((ticker) => {
      const [base, quote] = ticker.symbol.split('_');

      return new Ticker({
        base,
        quote,
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

module.exports = Omgfin;
