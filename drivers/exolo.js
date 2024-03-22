const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils');

/**
 * @memberof Driver
 * @augments Driver
 */
class Exolo extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const markets = await request('https://openapi.exolo.org/open/v2/pub/ticker');

    return Object.keys(markets).map((market) => {
      const ticker = markets[market];
      const [base, quote] = market.split('_');

      return new Ticker({
        base,
        quote,
        close: parseToFloat(ticker.last_price),
        baseVolume: parseToFloat(ticker['24_base_volume']),
        quoteVolume: parseToFloat(ticker['24_quote_volume']),
      });
    });
  }
}

module.exports = Exolo;
