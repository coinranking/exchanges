const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

/**
 * @memberof Driver
 * @augments Driver
 */
class Finexbox extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const { result: tickers } = await request('https://xapi.finexbox.com/v1/market');

    return tickers.map((ticker) => {
      const [base, quote] = ticker.market.split('_');

      return new Ticker({
        base,
        baseName: ticker.currency,
        quote,
        // Warning: Finexbox inverts base and quote
        baseVolume: parseToFloat(ticker.volume),
        high: parseToFloat(ticker.high),
        low: parseToFloat(ticker.low),
        close: parseToFloat(ticker.price),
      });
    });
  }
}

module.exports = Finexbox;
