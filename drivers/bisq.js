const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils');

/**
 * @memberof Driver
 * @augments Driver
 */
class Bisq extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const tickers = await request('https://markets.bisq.network/api/ticker');
    const markets = Object.keys(tickers);

    return markets.map((market) => {
      const [base, quote] = market.split('_');
      const ticker = tickers[market];
      if (!ticker) return undefined;

      return new Ticker({
        base,
        quote,
        quoteVolume: parseToFloat(ticker.volume_right),
        baseVolume: parseToFloat(ticker.volume_left),
        close: parseToFloat(ticker.last),
        high: parseToFloat(ticker.high),
        low: parseToFloat(ticker.low),
      });
    });
  }
}

module.exports = Bisq;
