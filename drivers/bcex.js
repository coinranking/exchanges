const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils');

/**
 * @memberof Driver
 * @augments Driver
 */
class Bcex extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const result = await request({
      url: 'https://www.bcex.top/api/rt/getTradeLists',
      headers: { 'X-Forwarded-Host': 'www.bcex.top' },
    });
    const quotes = Object.keys(result.data.main);

    const tickers = [].concat(...quotes.map((quote) => result.data.main[quote]));

    return tickers.map((ticker) => {
      const base = ticker.token;
      const quote = ticker.market;

      return new Ticker({
        base,
        quote,
        quoteVolume: parseToFloat(ticker.vol),
        baseVolume: parseToFloat(ticker.amount),
        close: parseToFloat(ticker.last),
        high: parseToFloat(ticker.max_price),
        low: parseToFloat(ticker.min_price),
      });
    });
  }
}

module.exports = Bcex;
