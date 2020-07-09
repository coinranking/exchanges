const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

/**
 * @memberof Driver
 * @augments Driver
 */
class Bithumbglobal extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const { data: { coinConfig: coins } } = await request('https://global-openapi.bithumb.pro/openapi/v1/spot/config');
    const { data: tickers } = await request('https://global-openapi.bithumb.pro/openapi/v1/spot/ticker?symbol=ALL');

    return tickers.map((ticker) => {
      const [base, quote] = ticker.s.split('-');
      const baseCoin = coins.find((coin) => coin.name === base);
      const quoteCoin = coins.find((coin) => coin.name === quote);

      let baseName;
      if (baseCoin) baseName = baseCoin.fullName;

      let quoteName;
      if (quoteCoin) quoteName = quoteCoin.fullName;

      return new Ticker({
        base,
        baseName,
        quote,
        quoteName,
        quoteVolume: parseToFloat(ticker.t),
        baseVolume: parseToFloat(ticker.v),
        open: parseToFloat(ticker.opening_price),
        high: parseToFloat(ticker.h),
        low: parseToFloat(ticker.l),
        close: parseToFloat(ticker.c),
      });
    });
  }
}

module.exports = Bithumbglobal;
