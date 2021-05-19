const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils');

/**
 * @memberof Driver
 * @augments Driver
 */
class Felixo extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const tickers = await request('https://api.felixo.com/v1/ticker');

    return tickers.map((ticker) => {
      const pairs = /^([A-Z]*)(TRY|USDC|BTC)$/.exec(ticker.pair);
      if (!pairs) return undefined;
      const [, base, quote] = pairs;

      return new Ticker({
        base,
        quote,
        quoteVolume: parseToFloat(ticker.volume),
        open: parseToFloat(ticker.openPrice),
        high: parseToFloat(ticker.highPrice),
        low: parseToFloat(ticker.lowPrice),
        close: parseToFloat(ticker.lastPrice),
      });
    });
  }
}

module.exports = Felixo;
