const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils');

/**
 * @memberof Driver
 * @augments Driver
 */
class Catex extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const { data: tickers } = await request('https://www.catex.io/api/token/list');

    return tickers.map((ticker) => {
      // Catex flips base and quote
      const [base, quote] = ticker.pair.split('/');

      return new Ticker({
        base,
        quote,
        baseVolume: parseToFloat(ticker.volume24HoursByCurrency),
        quoteVolume: parseToFloat(ticker.volume24HoursByBaseCurrency),
        close: parseToFloat(ticker.priceByBaseCurrency),
      });
    });
  }
}

module.exports = Catex;
