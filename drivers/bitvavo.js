const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils');

/**
 * @memberof Driver
 * @augments Driver
 */
class Bitvavo extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const tickers = await request('https://api.bitvavo.com/v2/ticker/24h');

    return tickers.map((ticker) => {
      const [base, quote] = ticker.market.split('-');

      return new Ticker({
        base,
        quote,
        baseVolume: parseToFloat(ticker.volume),
        quoteVolume: parseToFloat(ticker.volumeQuote),
        open: parseToFloat(ticker.open),
        high: parseToFloat(ticker.high),
        low: parseToFloat(ticker.low),
        close: parseToFloat(ticker.last),
      });
    });
  }
}

module.exports = Bitvavo;
