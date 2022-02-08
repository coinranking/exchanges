const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils');

/**
 * @memberof Driver
 * @augments Driver
 */
class Bl3p extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const bases = ['BTC'];

    const tickers = bases.map(async (base) => {
      const ticker = await request(`https://api.bl3p.eu/1/${base}EUR/ticker`);
      const quote = 'EUR';

      return new Ticker({
        base,
        quote,
        baseVolume: parseToFloat(ticker.volume['24h']),
        high: parseToFloat(ticker.high),
        low: parseToFloat(ticker.low),
        close: parseToFloat(ticker.last),
      });
    });

    return Promise.all(tickers);
  }
}

module.exports = Bl3p;
