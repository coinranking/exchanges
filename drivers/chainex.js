const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils');

/**
 * @memberof Driver
 * @augments Driver
 */
class ChainEx extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const { data: tickers } = await request('https://api.chainex.io/market/summary/');

    return tickers.map((ticker) => {
      const [base, quote] = ticker.market.split('/');

      return new Ticker({
        base,
        baseName: ticker.name,
        quote,
        high: parseToFloat(ticker['24hhigh']),
        low: parseToFloat(ticker['24hlow']),
        close: parseToFloat(ticker.last_price),
        bid: parseToFloat(ticker.top_bid),
        ask: parseToFloat(ticker.top_ask),
        baseVolume: parseToFloat(ticker.volume_amount),
        quoteVolume: parseToFloat(ticker['24hvol']),
      });
    });
  }
}

module.exports = ChainEx;
