const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

/**
 * @memberof Driver
 * @augments Driver
 */
class Tradeogre extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const markets = await request('https://tradeogre.com/api/v1/markets');

    return markets.map((market) => {
      const pair = Object.keys(market)[0];
      const [quote, base] = pair.split('-');
      const ticker = market[pair];

      return new Ticker({
        base,
        quote,
        high: parseToFloat(ticker.high),
        low: parseToFloat(ticker.low),
        close: parseToFloat(ticker.price),
        open: parseToFloat(ticker.initialprice),
        bid: parseToFloat(ticker.bid),
        ask: parseToFloat(ticker.ask),
        baseVolume: parseToFloat(ticker.volume),
      });
    });
  }
}

module.exports = Tradeogre;
