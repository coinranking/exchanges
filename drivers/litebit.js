const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils');

/**
 * @memberof Driver
 * @augments Driver
 */
class Litebit extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const data = await request('https://api.litebit.eu/markets');
    const tickers = Object.values(data.result);

    return tickers.map((ticker) => {
      const base = ticker.abbr.toUpperCase();
      const quote = 'EUR';

      return new Ticker({
        base,
        quote,
        baseVolume: parseToFloat(ticker.volume),
        close: parseToFloat(ticker.buy),
      });
    });
  }
}

module.exports = Litebit;
