const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat, isUndefined } = require('../lib/utils.js');

/**
 * @memberof Driver
 * @augments Driver
 */
class Gmojapan extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const { data: tickers } = await request('https://api.coin.z.com/public/v1/ticker');

    return tickers.map((ticker) => {
      const [base, quote] = ticker.symbol.split('_');

      if (isUndefined(quote)) return undefined;

      return new Ticker({
        base,
        quote,
        high: parseToFloat(ticker.high),
        low: parseToFloat(ticker.low),
        close: parseToFloat(ticker.last),
        bid: parseToFloat(ticker.bid),
        ask: parseToFloat(ticker.ask),
        baseVolume: parseToFloat(ticker.volume),
      });
    });
  }
}

module.exports = Gmojapan;
