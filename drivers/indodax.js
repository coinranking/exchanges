const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils');

/**
 * @memberof Driver
 * @augments Driver
 */
class Indodax extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const { tickers } = await request('https://indodax.com/api/ticker_all');

    const markets = Object.keys(tickers);

    return markets.map((market) => {
      const ticker = tickers[market];
      const [base, quote] = market.split('_');

      return new Ticker({
        base,
        quote,
        baseVolume: parseToFloat(ticker[`vol_${base}`]),
        quoteVolume: parseToFloat(ticker[`vol_${quote}`]),
        high: parseToFloat(ticker.high),
        low: parseToFloat(ticker.low),
        close: parseToFloat(ticker.last),
        bid: parseToFloat(ticker.buy),
        ask: parseToFloat(ticker.sell),
      });
    });
  }
}

module.exports = Indodax;
