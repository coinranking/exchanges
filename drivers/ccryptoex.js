const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils');

/**
 * @memberof Driver
 * @augments Driver
 */
class Ccryptoex extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const markets = await request('https://ccryptoex.com/api/tickers');

    return Object.keys(markets).map((market) => {
      const { ticker } = markets[market];
      const [base, quote] = market.split('_');

      return new Ticker({
        base,
        quote,
        high: parseToFloat(ticker.high),
        low: parseToFloat(ticker.low),
        close: parseToFloat(ticker.last),
        bid: parseToFloat(ticker.buy), // reversed with sell
        ask: parseToFloat(ticker.sell),
        baseVolume: parseToFloat(ticker.volume),
      });
    });
  }
}

module.exports = Ccryptoex;
