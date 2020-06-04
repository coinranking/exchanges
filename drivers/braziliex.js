const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

/**
 * @memberof Driver
 * @augments Driver
 */
class Braziliex extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const markets = await request('https://braziliex.com/api/v1/public/ticker');
    const tickers = Object.values(markets);

    return tickers
      .filter((ticker) => (ticker.active === 1))
      .map((ticker) => {
        const [base, quote] = ticker.market.split('_');

        return new Ticker({
          base,
          quote,
          baseVolume: parseToFloat(ticker.baseVolume),
          quoteVolume: parseToFloat(ticker.quoteVolume),
          close: parseToFloat(ticker.last),
        });
      });
  }
}

module.exports = Braziliex;
