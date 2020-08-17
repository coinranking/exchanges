const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

/**
 * @memberof Driver
 * @augments Driver
 */
class Bitcoiva extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const { pairlist: markets } = await request('https://www.bitcoiva.com/api/tickers');

    return Object.keys(markets).map((market) => {
      const ticker = markets[market];
      // eslint-disable-next-line no-useless-escape
      const [base, quote] = market.split('\/');

      return new Ticker({
        base,
        baseName: ticker.base_full_name,
        quote,
        high: parseToFloat(ticker.high),
        low: parseToFloat(ticker.low),
        close: parseToFloat(ticker.current_price),
        open: parseToFloat(ticker.start_price),
        baseVolume: parseToFloat(ticker.volume),
      });
    });
  }
}

module.exports = Bitcoiva;
