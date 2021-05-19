const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils');

/**
 * @memberof Driver
 * @augments Driver
 */
class Hitbtc extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const pairs = await request('https://api.hitbtc.com/api/2/public/symbol');
    const tickers = await request('https://api.hitbtc.com/api/2/public/ticker');

    return pairs.map((pair) => {
      const base = pair.baseCurrency;
      const quote = pair.quoteCurrency;

      const ticker = tickers.find((item) => item.symbol === pair.id);
      if (!ticker) return undefined;

      return new Ticker({
        base,
        quote,
        quoteVolume: parseToFloat(ticker.volumeQuote),
        baseVolume: parseToFloat(ticker.volume),
        close: parseToFloat(ticker.last),
        open: parseToFloat(ticker.open),
        high: parseToFloat(ticker.high),
        low: parseToFloat(ticker.low),
      });
    });
  }
}

module.exports = Hitbtc;
