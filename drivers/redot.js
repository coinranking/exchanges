const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat, throttleMap } = require('../lib/utils');

/**
 * @memberof Driver
 * @augments Driver
 */
class Redot extends Driver {
  /**
   * @param {boolean} isMocked Set to true when stored tickers are used
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers(isMocked) {
    const { result: markets } = await request('https://api.redot.com/v1/public/get-instruments');

    const tickers = throttleMap(markets, async (market) => {
      const [base, quote] = market.id.split('-');

      const { result: ticker } = await request(`https://api.redot.com/v1/public/get-stats?instrumentId=${market.id}`);

      return new Ticker({
        base,
        quote,
        high: parseToFloat(ticker.high),
        low: parseToFloat(ticker.low),
        close: parseToFloat(ticker.last),
        open: parseToFloat(ticker.first),
        baseVolume: parseToFloat(ticker.volume),
      });
    }, isMocked ? 0 : 50); // Limited to 20 requests a second

    return Promise.all(tickers);
  }
}

module.exports = Redot;
