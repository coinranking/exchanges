const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

/**
 * @memberof Driver
 * @augments Driver
 */
class Shortex extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
  // get base and quote data for tickers
    const symbols = await request('https://exchange.shortex.net/api/v2/backend/public/markets');
    const pairs = {};

    symbols.forEach((el) => {
      pairs[el.id] = {
        base: el.base_unit,
        quote: el.quote_unit,
      };
    });

    const tickers = await request('https://exchange.shortex.net/api/v2/backend/public/markets/tickers');

    return Object.keys(tickers).map((tickerName) => {
      const { ticker } = tickers[tickerName];
      const { base, quote } = pairs[tickerName];

      return new Ticker({
        base,
        quote,
        high: parseToFloat(ticker.high),
        low: parseToFloat(ticker.low),
        close: parseToFloat(ticker.last),
        baseVolume: parseToFloat(ticker.vol),
      });
    });
  }
}

module.exports = Shortex;
