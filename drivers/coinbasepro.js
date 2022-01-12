const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat, throttleMap } = require('../lib/utils');

/**
 * @memberof Driver
 * @augments Driver
 */
class Coinbasepro extends Driver {
  /**
   * @param {boolean} isMocked Set to true when stored tickers are used
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers(isMocked) {
    const pairs = await request('https://api.pro.coinbase.com/products');
    const activePairs = pairs.filter((pair) => pair.status === 'online');

    const tickers = throttleMap(activePairs, async (pair) => {
      const ticker = await request(`https://api.pro.coinbase.com/products/${pair.id}/ticker`);

      const base = pair.base_currency;
      const quote = pair.quote_currency;

      return new Ticker({
        base,
        quote,
        baseVolume: parseToFloat(ticker.volume),
        close: parseToFloat(ticker.price),
      });
    }, isMocked ? 0 : 100); // Limited to 10 requests a second

    return Promise.all(tickers);
  }
}

module.exports = Coinbasepro;
