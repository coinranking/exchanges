const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { flatMap, parseToFloat } = require('../lib/utils');

/**
 * @memberof Driver
 * @augments Driver
 */
class Catex extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const quotesResult = await request('https://www.catex.io/api/token/baseCurrency');
    const quotes = quotesResult.data;

    // Warning: Catex inverts base and quote
    return flatMap(quotes, async (quote) => {
      const result = await request(`https://www.catex.io/quote/${quote}/list.json`);
      const tickers = result.data;

      return tickers.map((ticker) => {
        const base = ticker.coinCode;

        return new Ticker({
          base,
          quote,
          quoteVolume: parseToFloat(ticker.dailyVolumeBase),
          baseVolume: parseToFloat(ticker.dailyVolume),
          close: parseToFloat(ticker.price),
        });
      });
    });
  }
}

module.exports = Catex;
