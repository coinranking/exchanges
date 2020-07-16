const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

/**
 * @memberof Driver
 * @augments Driver
 */
class Coindcx extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const symbols = await request('https://api.coindcx.com/exchange/v1/markets_details');
    const pairs = [];

    symbols.forEach((el) => {
      pairs[el.symbol] = {
        quote: el.base_currency_short_name,
        base: el.target_currency_short_name,
        quoteName: el.base_currency_name,
        baseName: el.target_currency_name,
      };
    });

    const tickers = await request('https://api.coindcx.com/exchange/ticker');

    return tickers.map((ticker) => {
      if (!pairs[ticker.market]) {
        return undefined;
      }

      const {
        base, quote, baseName, quoteName,
      } = pairs[ticker.market];

      return new Ticker({
        base,
        baseName,
        quote,
        quoteName,
        high: parseToFloat(ticker.high),
        low: parseToFloat(ticker.low),
        close: parseToFloat(ticker.last_price),
        baseVolume: parseToFloat(ticker.volume),
      });
    });
  }
}

module.exports = Coindcx;
