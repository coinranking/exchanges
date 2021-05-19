const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils');

/**
 * @memberof Driver
 * @augments Driver
 */
class Huobiglobal extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const { data: pairs } = await request('https://api.huobi.pro/v1/common/symbols');
    const { data: tickers } = await request('https://api.huobi.pro/market/tickers');

    return pairs.map((pair) => {
      const base = pair['base-currency'];
      const quote = pair['quote-currency'];

      const ticker = tickers.find((item) => item.symbol === pair.symbol);
      if (!ticker) return undefined;

      return new Ticker({
        base,
        quote,
        quoteVolume: parseToFloat(ticker.vol),
        close: parseToFloat(ticker.close),
        open: parseToFloat(ticker.open),
        high: parseToFloat(ticker.high),
        low: parseToFloat(ticker.low),
      });
    });
  }
}

module.exports = Huobiglobal;
