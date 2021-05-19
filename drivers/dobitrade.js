const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat, throttleMap } = require('../lib/utils');

/**
 * @memberof Driver
 * @augments Driver
 */
class Dobitrade extends Driver {
  /**
   * @param {boolean} isMocked Set to true when stored tickers are used
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers(isMocked) {
    const { data: markets } = await request('https://api.dobiexchange.com/trade/markets');

    const tickers = throttleMap(markets, async (market) => {
      const [base, quote] = market.split('_');
      const { data: ticker } = await request(`https://api.dobiexchange.com/market/quote?market=${market}`);

      if (!ticker) return undefined;

      return new Ticker({
        base,
        quote,
        baseVolume: parseToFloat(ticker.volume),
        quoteVolume: parseToFloat(ticker.amount),
        high: parseToFloat(ticker.high),
        low: parseToFloat(ticker.low),
        close: parseToFloat(ticker.last),
        bid: parseToFloat(ticker.buy),
        ask: parseToFloat(ticker.sell),
      });
    }, isMocked ? 0 : 50); // 20 request per second

    return Promise.all(tickers);
  }
}

module.exports = Dobitrade;
