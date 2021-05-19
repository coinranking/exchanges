const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils');

/**
 * @memberof Driver
 * @augments Driver
 */
class Btcexchange extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const tickers = await request('https://api.btc-exchange.com/papi/web/tickers');
    const markets = Object.keys(tickers);

    return markets.map((market) => {
      const pair = /^([a-z]*)(eur|usdc)$/.exec(market);
      if (!pair) return undefined;
      const [, base, quote] = pair;
      const { ticker } = tickers[market];

      return new Ticker({
        base,
        quote,
        baseVolume: parseToFloat(ticker.vol),
        close: parseToFloat(ticker.last),
        high: parseToFloat(ticker.high),
        low: parseToFloat(ticker.low),
      });
    });
  }
}

module.exports = Btcexchange;
