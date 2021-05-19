const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils');

/**
 * @memberof Driver
 * @augments Driver
 */
class Codex extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const result = await request('https://api.codex.one/tickers');
    const tickers = Object.values(result.data);

    return tickers.map((ticker) => {
      const base = ticker.base_unit;
      const quote = ticker.quote_unit;

      return new Ticker({
        base,
        quote,
        quoteVolume: parseToFloat(ticker.quote_volume),
        baseVolume: parseToFloat(ticker.volume),
        close: parseToFloat(ticker.last),
        open: parseToFloat(ticker.open),
        high: parseToFloat(ticker.high),
        low: parseToFloat(ticker.low),
      });
    });
  }
}

module.exports = Codex;
