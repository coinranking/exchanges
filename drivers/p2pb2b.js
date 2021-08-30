const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils');

/**
 * @memberof Driver
 * @augments Driver
 */
class P2pb2b extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const data = await request('https://p2pb2b.io/api/v2/public/tickers');
    const tickers = data.result;
    const pairs = Object.keys(tickers);

    return pairs.map((pair) => {
      const [base, quote] = pair.split('_');
      const { ticker } = tickers[pair];

      return new Ticker({
        base,
        quote,
        baseVolume: parseToFloat(ticker.vol),
        quoteVolume: parseToFloat(ticker.deal),
        close: parseToFloat(ticker.last),
      });
    });
  }
}

module.exports = P2pb2b;
