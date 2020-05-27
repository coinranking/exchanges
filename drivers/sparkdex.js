const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

/**
 * @memberof Driver
 * @augments Driver
 */
class Sparkdex extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const tickers = await request('https://pricing.bitspark.io/api/v1/asset-pairs');

    return tickers.map((ticker) => {
      const tickerMarket = Object.keys(ticker)[0];
      const tickerDetails = ticker[tickerMarket];

      // Warning: Sparkdex inverts base and quote only in the pair
      return new Ticker({
        base: tickerDetails.quoteName,
        quote: tickerDetails.baseName,
        close: parseToFloat(tickerDetails.last),
        baseVolume: parseToFloat(tickerDetails.quoteVolume),
        quoteVolume: parseToFloat(tickerDetails.baseVolume),
      });
    });
  }
}

module.exports = Sparkdex;
