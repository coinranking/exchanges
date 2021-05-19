const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils');

/**
 * @memberof Driver
 * @augments Driver
 */
class Oceanex extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const { data: tickers } = await request('https://api.oceanex.pro/v1/tickers');
    const markets = Object.keys(tickers);

    return markets.map((market) => {
      const ticker = tickers[market];
      const base = ticker.base_unit;
      const quote = ticker.quote_unit;

      return new Ticker({
        base,
        quote,
        baseVolume: parseToFloat(ticker.volume),
        quoteVolume: parseToFloat(ticker.funds),
        open: parseToFloat(ticker.first),
        high: parseToFloat(ticker.high),
        low: parseToFloat(ticker.high),
        close: parseToFloat(ticker.last),
      });
    });
  }
}

module.exports = Oceanex;
