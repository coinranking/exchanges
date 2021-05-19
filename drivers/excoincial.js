const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils');

/**
 * @memberof Driver
 * @augments Driver
 */
class Excoincial extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
  // get base and quote data for tickers
    const symbols = await request('https://excoincial.com/api/v2/markets');
    const pairs = {};

    symbols.forEach((el) => {
      const [base, quote] = el.name.split('/');
      pairs[el.id] = {
        base,
        quote,
      };
    });

    const markets = await request('https://excoincial.com/api/v2/tickers');

    return Object.keys(markets).map((market) => {
      const { base, quote } = pairs[market];
      const { ticker } = markets[market];

      return new Ticker({
        base,
        quote,
        high: parseToFloat(ticker.high),
        low: parseToFloat(ticker.low),
        close: parseToFloat(ticker.last),
        baseVolume: parseToFloat(ticker.vol),
        quoteVolume: parseToFloat(ticker.quotevol),
      });
    });
  }
}

module.exports = Excoincial;
