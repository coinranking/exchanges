const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat, throttleMap } = require('../lib/utils');

/**
 * @memberof Driver
 * @augments Driver
 */
class Fcoin extends Driver {
  /**
   * @param {boolean} isMocked Set to true when stored tickers are used
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers(isMocked) {
    const { data: markets } = await request('https://api.fcoin.com/v2/public/symbols');

    const tickers = throttleMap(markets.filter((market) => market.tradable), async (market) => {
      try {
      /* ["Latest transaction price",
          "the most recent trading volume",
          "The highest buy 1 price",
          "The biggest buy 1 volume",
          "The lowest sell 1 price",
          "The smallest sell 1 volume",
          "The transaction price before 24 hours",
          "The highest price in 24 hours",
          "The lowest price in 24 hours",
          "The base currency volume within 24 hours, such as the amount of btc in btcusdt",
          "Priced currency volume within 24 hours, such as the amount of usdt in btcusdt"] */

        const { data } = await request(`https://api.fcoin.com/v2/market/ticker/${market.name}`);
        const { ticker } = data;

        const base = market.base_currency;
        const quote = market.quote_currency;

        return new Ticker({
          base,
          quote,
          quoteVolume: parseToFloat(ticker[10]),
          baseVolume: parseToFloat(ticker[9]),
          close: parseToFloat(ticker[0]),
          open: parseToFloat(ticker[6]),
          high: parseToFloat(ticker[7]),
          low: parseToFloat(ticker[8]),
        });
      } catch (error) {
        return undefined;
      }
    }, isMocked ? 0 : 20); // Batches of 50 requests per second

    return Promise.all(tickers);
  }
}

module.exports = Fcoin;
