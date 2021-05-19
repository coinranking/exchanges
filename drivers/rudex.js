const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils');

/**
 * @memberof Driver
 * @augments Driver
 */
class Rudex extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const markets = await request('https://ticker.rudex.org/api/v1/ticker');

    return Object.keys(markets).map((market) => {
      const [base, quote] = market.split('_'); // reversed
      const ticker = markets[market];

      return new Ticker({
        base,
        quote,
        close: parseToFloat(ticker.last_price),
        bid: parseToFloat(ticker.lowest_ask),
        ask: parseToFloat(ticker.highest_bid),
        baseVolume: parseToFloat(ticker.quote_volume), // reversed
        quoteVolume: parseToFloat(ticker.base_volume),
      });
    });
  }
}

module.exports = Rudex;
