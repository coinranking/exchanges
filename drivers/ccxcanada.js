const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils');

/**
 * @memberof Driver
 * @augments Driver
 */
class Ccxcanada extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const data = await request('https://ccxcanada.com/api/v2/tickers');
    const markets = Object.values(data);

    return markets.map((market) => {
      const base = market.base_unit;
      const quote = market.quote_unit;
      const { ticker } = market;

      return new Ticker({
        base,
        quote,
        baseVolume: parseToFloat(ticker.vol),
        open: parseToFloat(ticker.open),
        high: parseToFloat(ticker.high),
        low: parseToFloat(ticker.low),
        close: parseToFloat(ticker.last),
      });
    });
  }
}

module.exports = Ccxcanada;
