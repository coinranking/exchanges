const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils');

/**
 * @memberof Driver
 * @augments Driver
 */
class Btcturk extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const { data: tickers } = await request('https://api.btcturk.com/api/v2/ticker');

    return tickers.map((ticker) => {
      const base = ticker.numeratorsymbol;
      const quote = ticker.denominatorsymbol;

      return new Ticker({
        base,
        quote,
        baseVolume: parseToFloat(ticker.volume),
        open: parseToFloat(ticker.open),
        high: parseToFloat(ticker.high),
        low: parseToFloat(ticker.low),
        close: parseToFloat(ticker.last),
        bid: parseToFloat(ticker.bid),
        ask: parseToFloat(ticker.ask),
      });
    });
  }
}

module.exports = Btcturk;
