const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils');

/**
 * @memberof Driver
 * @augments Driver
 */
class Ordifind extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const { data: tickers } = await request('https://market-api.ordifind.com/api/v1/tokenlist');

    return tickers.map((ticker) => {
      const base = ticker.Name;
      const quote = 'DOGE';

      return new Ticker({
        base,
        quote,
        quoteVolume: parseToFloat(ticker.Volume),
        close: parseToFloat(ticker.Price),
      });
    });
  }
}

module.exports = Ordifind;
