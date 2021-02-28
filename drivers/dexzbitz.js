const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

/**
 * @memberof Driver
 * @augments Driver
 */
class Dexzbitz extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const { data: { market: tickers } } = await request('https://dexzbitz.live/Api/Index/marketInfo');

    return tickers.map((ticker) => {
      const [base, quote] = ticker.ticker.split('_');

      return new Ticker({
        base,
        quote,
        high: parseToFloat(ticker['24hHigh']),
        low: parseToFloat(ticker['24hlaw']),
        close: parseToFloat(ticker.lastprice),
        bid: parseToFloat(ticker.buy_price),
        ask: parseToFloat(ticker.sell_price),
        baseVolume: parseToFloat(ticker.volume),
      });
    });
  }
}

module.exports = Dexzbitz;
