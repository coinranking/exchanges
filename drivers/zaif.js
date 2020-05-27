const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat, throttleMap } = require('../lib/utils.js');

/**
 * @memberof Driver
 * @augments Driver
 */
class Zaif extends Driver {
  /**
   * @param {boolean} isMocked Set to true when stored tickers are used
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers(isMocked) {
    const markets = await request('https://api.zaif.jp/api/1/currency_pairs/all');

    const tickers = throttleMap(markets, async (market) => {
      const [base, quote] = market.name.split('/');

      const ticker = await request(`https://api.zaif.jp/api/1/ticker/${market.currency_pair}`);

      return new Ticker({
        base,
        quote,
        baseVolume: parseToFloat(ticker.volume),
        high: parseToFloat(ticker.high),
        low: parseToFloat(ticker.low),
        close: parseToFloat(ticker.last),
      });
    }, isMocked ? 0 : 50); // Limited to 20 requests a second

    return Promise.all(tickers);
  }
}

module.exports = Zaif;
