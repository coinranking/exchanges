const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

/**
 * @memberof Driver
 * @augments Driver
 */
class Bitasset extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const { data: tickers } = await request({
      url: 'https://api.bitasset.com/spot/v2/public/AllTicker',
      headers: { Accept: 'application/json' },
      rejectUnauthorized: false,
    });

    return tickers.map((ticker) => {
      const [base, quote] = ticker.pair.split('-');

      return new Ticker({
        base,
        quote,
        high: parseToFloat(ticker.high24hr),
        low: parseToFloat(ticker.low24hr),
        close: parseToFloat(ticker.lastPrice),
        baseVolume: parseToFloat(ticker.volume24hr),
      });
    });
  }
}

module.exports = Bitasset;
