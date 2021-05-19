const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils');

/**
 * @memberof Driver
 * @augments Driver
 */
class Bxinth extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const data = await request('https://bx.in.th/api/');
    const tickers = Object.values(data);

    return tickers.map((ticker) => {
      const base = ticker.secondary_currency;
      const quote = ticker.primary_currency;

      return new Ticker({
        base,
        quote,
        baseVolume: parseToFloat(ticker.volume_24hours),
        close: parseToFloat(ticker.last_price),
      });
    });
  }
}

module.exports = Bxinth;
