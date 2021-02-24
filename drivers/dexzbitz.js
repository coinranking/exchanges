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
    const markets = await request('https://dexzbitz.live/Api/Index/marketInfo');

    return Object.keys(markets).map((market) => {
      const [base, quote] = market.split('_');
      const ticker = markets[market];

      return new Ticker({
        base,
        quote,
        high: parseToFloat(ticker.24hHigh),
        low: parseToFloat(ticker.24hlaw),
        close: parseToFloat(ticker.lastprice),
        baseVolume: parseToFloat(ticker.volume), // reversed with quote volume
       ,
      });
    });
  }
}

module.exports = Dexzbitz;