const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils');

/**
 * @memberof Driver
 * @augments Driver
 */
class Coinbig extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const { data: pairs } = await request('https://www.coinbig.com/api/publics/vip/tickers');

    return pairs.map((pair) => {
      const tickerKey = Object.keys(pair)[0];

      const [base, quote] = tickerKey.split('_');

      const { ticker } = pair[tickerKey];

      return new Ticker({
        base,
        quote,
        high: parseToFloat(ticker.high),
        low: parseToFloat(ticker.low),
        close: parseToFloat(ticker.last),
        bid: parseToFloat(ticker.buy),
        ask: parseToFloat(ticker.sell),
        baseVolume: parseToFloat(ticker.vol),
      });
    });
  }
}

module.exports = Coinbig;
