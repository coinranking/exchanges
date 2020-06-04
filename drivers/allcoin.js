const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { flatMap, parseToFloat } = require('../lib/utils');

/**
 * @memberof Driver
 * @augments Driver
 */
class Allcoin extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const data = await request('https://www.allcoin.ca/Api_Market/getPriceList');
    const quotes = Object.keys(data);

    return flatMap(quotes, (quote) => {
      const tickers = data[quote];

      return tickers.map((ticker) => {
        const base = ticker.coin_from;

        return new Ticker({
          base,
          quote,
          baseVolume: parseToFloat(ticker.count),
          close: parseToFloat(ticker.current),
          high: parseToFloat(ticker.max),
          low: parseToFloat(ticker.min),
        });
      });
    });
  }
}

module.exports = Allcoin;
