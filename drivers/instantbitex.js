const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

/**
 * @memberof Driver
 * @augments Driver
 */
class Instantbitex extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const { combinations: tickers } = await request('https://api.instantbitex.com/tickers');
    const markets = Object.keys(tickers);

    return markets.map((market) => {
      const [base, quote] = market.split('_');
      const ticker = tickers[market];

      return new Ticker({
        base,
        quote,
        quoteVolume: parseToFloat(ticker.volume24hr),
        close: parseToFloat(ticker.last),
      });
    });
  }
}

module.exports = Instantbitex;
