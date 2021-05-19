const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils');

/**
 * @memberof Driver
 * @augments Driver
 */
class Bequant extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const markets = await request('https://api.bequant.io/api/2/public/symbol');
    const tickers = await request('https://api.bequant.io/api/2/public/ticker');

    return markets.map((market) => {
      const base = market.baseCurrency;
      const quote = market.quoteCurrency;

      const ticker = tickers.find((item) => item.symbol === market.id);
      if (!ticker) return undefined;

      return new Ticker({
        base,
        quote,
        quoteVolume: parseToFloat(ticker.volumeQuote),
        baseVolume: parseToFloat(ticker.volume),
        open: parseToFloat(ticker.open),
        high: parseToFloat(ticker.high),
        low: parseToFloat(ticker.low),
        close: parseToFloat(ticker.last),
      });
    });
  }
}

module.exports = Bequant;
