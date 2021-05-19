const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils');

/**
 * @memberof Driver
 * @augments Driver
 */
class Sigenpro extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const { data: { pairs: markets1 } } = await request('https://sigen.pro/v1/web-public/exchange/summary');
    const { data: { pairs: markets2 } } = await request('https://sigen.pro/v1/server-public/p2p/info/summary');

    const markets = { ...markets1, ...markets2 };

    return Object.keys(markets).map((market) => {
      const [base, quote] = market.split('_');
      const ticker = markets[market];

      return new Ticker({
        base,
        quote,
        high: parseToFloat(ticker.high24hr),
        low: parseToFloat(ticker.low24hr),
        close: parseToFloat(ticker.last),
        baseVolume: parseToFloat(ticker.baseVolume),
        quoteVolume: parseToFloat(ticker.quoteVolume),
      });
    });
  }
}

module.exports = Sigenpro;
