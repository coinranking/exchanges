const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils');

/**
 * @memberof Driver
 * @augments Driver
 */
class Coinfield extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const { markets } = await request('https://api.coinfield.com/v1/markets');
    const { tickers } = await request('https://api.coinfield.com/v1/tickers');

    return markets.map((market) => {
      const ticker = tickers[market.id];

      return new Ticker({
        base: market.ask_unit,
        quote: market.bid_unit,
        open: parseToFloat(ticker.open),
        high: parseToFloat(ticker.high),
        low: parseToFloat(ticker.low),
        close: parseToFloat(ticker.last),
        bid: parseToFloat(ticker.bid),
        ask: parseToFloat(ticker.ask),
        baseVolume: parseToFloat(ticker.volume),
      });
    });
  }
}

module.exports = Coinfield;
