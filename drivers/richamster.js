const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

/**
 * @memberof Driver
 * @augments Driver
 */
class Richamster extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const markets = await request('https://richamster.com/api/v1/ticker');
    const marketsDetails = await request('https://richamster.com/public/v1/exchange/ticker/');

    return Object.keys(markets).map((marketName) => {
      const [base, quote] = marketName.split('_');
      // eslint-disable-next-line camelcase
      const { quote_volume, base_volume, last_price } = markets[marketName];

      const { first, high, low } = marketsDetails.find((item) => item.pair === `${base}/${quote}`);

      return new Ticker({
        base,
        quote,
        high: parseToFloat(high),
        low: parseToFloat(low),
        close: parseToFloat(last_price),
        open: parseToFloat(first),
        baseVolume: parseToFloat(base_volume),
        quoteVolume: parseToFloat(quote_volume),
      });
    });
  }
}

module.exports = Richamster;
