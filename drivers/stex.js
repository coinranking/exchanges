const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

/**
 * @memberof Driver
 * @augments Driver
 */
class Stex extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const tickers = await request('https://app.stex.com/api2/ticker');

    return tickers
      .filter((ticker) => ticker.active === 'true')
      .map((ticker) => {
        const [base, quote] = ticker.market_name.split('_');

        return new Ticker({
          base,
          quote,
          quoteVolume: parseToFloat(ticker.vol_market),
          close: parseToFloat(ticker.last),
          baseVolume: parseToFloat(ticker.vol),
        });
      });
  }
}

module.exports = Stex;
