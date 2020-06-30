const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

/**
 * @memberof Driver
 * @augments Driver
 */
class Xbtpro extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const { result: tickers } = await request('https://trade.xbtpro.com/api/prices');

    return tickers.map((ticker) => {
      const [base, quote] = ticker.symbol.split('/');

      return new Ticker({
        base,
        quote,
        high: parseToFloat(ticker.high),
        low: parseToFloat(ticker.low),
        close: parseToFloat(ticker.last),
        ask: parseToFloat(ticker.ask),
        bid: parseToFloat(ticker.bid),
        baseVolume: parseToFloat(ticker.volume.base),
        quoteVolume: parseToFloat(ticker.volume.quote),
      });
    });
  }
}

module.exports = Xbtpro;
