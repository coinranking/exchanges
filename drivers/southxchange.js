const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils');

/**
 * @memberof Driver
 * @augments Driver
 */
class Southxchange extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const tickers = await request('https://www.southxchange.com/api/prices');

    return tickers.map((ticker) => {
      const [base, quote] = ticker.Market.split('/');

      return new Ticker({
        base,
        quote,
        baseVolume: parseToFloat(ticker.Volume24Hr),
        close: parseToFloat(ticker.Last),
      });
    });
  }
}

module.exports = Southxchange;
