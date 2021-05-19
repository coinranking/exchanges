const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils');

/**
 * @memberof Driver
 * @augments Driver
 */
class Bitstamp extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const pairs = await request('https://www.bitstamp.net/api/v2/trading-pairs-info/');

    const tickers = pairs.map(async (pair) => {
      const ticker = await request(`https://www.bitstamp.net/api/v2/ticker/${pair.url_symbol}/`);

      const [base, quote] = pair.name.split('/');

      return new Ticker({
        base,
        quote,
        baseVolume: parseToFloat(ticker.volume),
        close: parseToFloat(ticker.last),
        open: parseToFloat(ticker.open),
        high: parseToFloat(ticker.high),
        low: parseToFloat(ticker.low),
        vwap: parseToFloat(ticker.vwap),
      });
    });

    return Promise.all(tickers);
  }
}

module.exports = Bitstamp;
