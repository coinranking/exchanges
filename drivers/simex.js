const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils');

/**
 * @memberof Driver
 * @augments Driver
 */
class Simex extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const { data: tickers } = await request('https://simex.global/api/cmc');

    return tickers.map((ticker) => {
      const [base, quote] = ticker.name.split('_');

      return new Ticker({
        base,
        quote,
        quoteVolume: parseToFloat(ticker.quote_volume),
        baseVolume: parseToFloat(ticker.base_volume),
        close: parseToFloat(ticker.last_price),
        high: parseToFloat(ticker.high_price),
        low: parseToFloat(ticker.low_price),
        bid: parseToFloat(ticker.buy_price),
        ask: parseToFloat(ticker.sell_price),
      });
    });
  }
}

module.exports = Simex;
