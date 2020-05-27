const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

/**
 * @memberof Driver
 * @augments Driver
 */
class Indoex extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const { marketdetails: tickers } = await request('https://api.indoex.io/getMarketDetails/');

    return tickers.map((ticker) => {
      const [base, quote] = ticker.pair.split('_');

      return new Ticker({
        base,
        quote,
        // Yes, Indoex confuses Base and Quote
        quoteVolume: parseToFloat(ticker.baseVolume),
        close: parseToFloat(ticker.last),
      });
    });
  }
}

module.exports = Indoex;
