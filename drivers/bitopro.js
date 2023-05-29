const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils');

/**
 * @memberof Driver
 * @augments Driver
 */
class Bitopro extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const { data: tickers } = await request('https://api.bitopro.com/v3/tickers');

    return tickers.map((ticker) => {
      const [base, quote] = ticker.pair.split('_');

      return new Ticker({
        base,
        quote,
        baseVolume: parseToFloat(ticker.volume24hr),
        high: parseToFloat(ticker.high24hr),
        low: parseToFloat(ticker.low24hr),
        close: parseToFloat(ticker.lastPrice),
      });
    });
  }
}

module.exports = Bitopro;
