const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

/**
 * @memberof Driver
 * @augments Driver
 */
class Graviex extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const markets = await request('https://graviex.net/api/v2/markets');
    const tickers = await request('https://graviex.net/api/v2/tickers');

    return markets.map((market) => {
      const { ticker } = tickers[market.id];
      if (!ticker) return undefined;

      const [base, quote] = market.name.split('/');

      return new Ticker({
        base,
        quote,
        baseVolume: parseToFloat(ticker.vol),
        high: parseToFloat(ticker.high),
        low: parseToFloat(ticker.low),
        close: parseToFloat(ticker.last),
      });
    });
  }
}

module.exports = Graviex;
