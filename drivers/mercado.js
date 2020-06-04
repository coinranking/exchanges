const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

/**
 * @memberof Driver
 * @augments Driver
 */
class Mercado extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const bases = ['BTC', 'LTC', 'BCH', 'XRP', 'ETH'];

    const tickers = bases.map(async (base) => {
      const { ticker } = await request(`https://www.mercadobitcoin.net/api/${base}/ticker/`);
      const quote = 'BRL';

      return new Ticker({
        base,
        quote,
        baseVolume: parseToFloat(ticker.vol),
        high: parseToFloat(ticker.high),
        low: parseToFloat(ticker.low),
        close: parseToFloat(ticker.last),
      });
    });

    return Promise.all(tickers);
  }
}

module.exports = Mercado;
