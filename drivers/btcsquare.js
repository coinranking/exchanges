const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils');

/**
 * @memberof Driver
 * @augments Driver
 */
class Btcsquare extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const markets = await request('https://www.btcsquare.net/api/v1/markets');
    const tickers = markets.map((item) => {
      const name = Object.keys(item)[0];
      const value = item[name];

      return ({
        name,
        ...value,
      });
    });

    return tickers.map((ticker) => {
      const [quote, base] = ticker.name.split('-');

      return new Ticker({
        base,
        quote,
        high: parseToFloat(ticker.high),
        low: parseToFloat(ticker.low),
        close: parseToFloat(ticker.price),
        bid: parseToFloat(ticker.bid),
        ask: parseToFloat(ticker.ask),
        baseVolume: parseToFloat(ticker.volume),
      });
    });
  }
}

module.exports = Btcsquare;
