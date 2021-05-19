const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils');

/**
 * @memberof Driver
 * @augments Driver
 */
class Extstock extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const { data: markets } = await request('https://extstock.com/api/v2/ticker');

    return Object.keys(markets).map((market) => {
      const [base, quote] = market.split('_');
      const ticker = markets[market];

      return new Ticker({
        base,
        quote,
        close: parseToFloat(ticker.last_price),
        ask: parseToFloat(ticker.high),
        bid: parseToFloat(ticker.low),
        baseVolume: parseToFloat(ticker.base_volume),
        quoteVolume: parseToFloat(ticker.quote_volume),
      });
    });
  }
}

module.exports = Extstock;
