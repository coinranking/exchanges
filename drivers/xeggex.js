const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils');

/**
 * @memberof Driver
 * @augments Driver
 */
class Xeggex extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const markets = await request('https://api.xeggex.com/api/v2/tickers');

    return Object.keys(markets).flatMap((market) => {
      const ticker = markets[market];

      return new Ticker({
        base: ticker.base_currency,
        quote: ticker.target_currency,
        high: parseToFloat(ticker.high),
        low: parseToFloat(ticker.low),
        const: parseToFloat(ticker.last_price),
        bid: parseToFloat(ticker.bid),
        ask: parseToFloat(ticker.ask),
        baseVolume: parseToFloat(ticker.base_volume),
        quoteVolume: parseToFloat(ticker.target_volume),
      });
    });
  }
}

module.exports = Xeggex;
