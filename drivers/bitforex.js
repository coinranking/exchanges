const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

/**
 * @memberof Driver
 * @augments Driver
 */
class Bitforex extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const data = await request('https://www.bitforex.com/server/market.act?cmd=searchTickers&type=all');
    const tickers = data.data;
    const pairs = Object.keys(tickers);

    return pairs.map((pair) => {
      const [, quote, base] = pair.split('-');
      const ticker = tickers[pair];

      return new Ticker({
        base,
        quote,
        quoteVolume: parseToFloat(ticker.cvol),
        baseVolume: parseToFloat(ticker.vol),
        close: parseToFloat(ticker.last),
        open: parseToFloat(ticker.open),
        high: parseToFloat(ticker.high),
        low: parseToFloat(ticker.low),
      });
    });
  }
}

module.exports = Bitforex;
