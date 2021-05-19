const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils');

/**
 * @memberof Driver
 * @augments Driver
 */
class Coinfalcon extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const { data: tickers } = await request('https://coinfalcon.com/api/v1/markets');

    return tickers.map((ticker) => {
      const [base, quote] = ticker.name.split('-');

      return new Ticker({
        base,
        quote,
        quoteVolume: parseToFloat(ticker.volume),
        close: parseToFloat(ticker.last_price),
      });
    });
  }
}

module.exports = Coinfalcon;
