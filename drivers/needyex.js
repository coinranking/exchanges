const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils');

/**
 * @memberof Driver
 * @augments Driver
 */
class Needyex extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const { data: { market: markets } } = await request('https://needyex.com/Api/Index/marketInfo');

    return markets.map((market) => {
      const [base, quote] = market.ticker.split('_');
      const ticker = market;

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

module.exports = Needyex;
