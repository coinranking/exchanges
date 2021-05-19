const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils');

/**
 * @memberof Driver
 * @augments Driver
 */
class Parsxc extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const { data: { market: tickers } } = await request('https://parsxc.com/Api/Index/marketInfo');

    return tickers.map((ticker) => {
      const [base, quote] = ticker.ticker.split('_');

      const [, baseName] = ticker.name.match(/(.*)\(.*\)/);

      return new Ticker({
        base,
        baseName,
        quote,
        high: parseToFloat(ticker.max_price),
        low: parseToFloat(ticker.min_price),
        close: parseToFloat(ticker.new_price),
        bid: parseToFloat(ticker.buy_price),
        ask: parseToFloat(ticker.sell_price),
        baseVolume: parseToFloat(ticker.volume),
      });
    });
  }
}

module.exports = Parsxc;
