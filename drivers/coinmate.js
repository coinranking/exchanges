const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat, throttleMap } = require('../lib/utils');

/**
 * @memberof Driver
 * @augments Driver
 */
class Coinmate extends Driver {
  /**
   * @param {boolean} isMocked Set to true when stored tickers are used
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers(isMocked) {
    const { data: markets } = await request('https://coinmate.io/api/tradingPairs');

    const tickers = throttleMap(markets, async (market) => {
      const { data: ticker } = await request(`https://coinmate.io/api/ticker?currencyPair=${market.name}`);

      if (!ticker) return undefined;

      const base = market.firstCurrency;
      const quote = market.secondCurrency;

      return new Ticker({
        base,
        quote,
        baseVolume: parseToFloat(ticker.amount),
        open: parseToFloat(ticker.open),
        high: parseToFloat(ticker.high),
        low: parseToFloat(ticker.low),
        close: parseToFloat(ticker.last),
      });
    }, isMocked ? 0 : 200); // 5 requests per second

    return Promise.all(tickers);
  }
}

module.exports = Coinmate;
