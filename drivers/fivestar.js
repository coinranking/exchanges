const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

/**
 * @memberof Driver
 * @augments Driver
 */
class Fivestar extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const markets = await request('https://fivestarexchange.in/public/ticker');

    return Object.keys(markets).map((market) => {
      const [quote, base] = market.split('_');
      const ticker = markets[market];

      return new Ticker({
        base,
        baseName: ticker.CurrencyFName,
        quote,
        high: parseToFloat(ticker.high24hr),
        low: parseToFloat(ticker.low24hr),
        close: parseToFloat(ticker.last),
        baseVolume: parseToFloat(ticker.quoteVolume),
        quoteVolume: parseToFloat(ticker.baseVolume),
      });
    });
  }
}

module.exports = Fivestar;
