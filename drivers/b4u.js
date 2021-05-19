const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils');

/**
 * @memberof Driver
 * @augments Driver
 */
class B4u extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const markets = await request('https://ewallet.b4uwallet.com/api/v2/peatio/public/markets');
    const tickers = await request('https://ewallet.b4uwallet.com/api/v2/peatio/public/markets/tickers');

    return markets.map((market) => {
      const { ticker } = tickers[market.id];

      return new Ticker({
        base: market.base_unit,
        quote: market.quote_unit,
        high: parseToFloat(ticker.high),
        low: parseToFloat(ticker.low),
        close: parseToFloat(ticker.last),
        bid: parseToFloat(ticker.buy),
        ask: parseToFloat(ticker.sell),
        quoteVolume: parseToFloat(ticker.volume),
      });
    });
  }
}

module.exports = B4u;
