const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

/**
 * @memberof Driver
 * @augments Driver
 */
class Bleutrade extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const { result: tickers } = await request('https://bleutrade.com/api/v3/public/getmarketsummaries');

    return tickers
      .filter((ticker) => (ticker.IsActive === 'true'))
      .map((ticker) => {
        const [base, quote] = ticker.MarketName.split('_');

        // Warning: Bleutrade inverts base and quote
        return new Ticker({
          base,
          quote,
          baseName: ticker.MarketAssetName,
          quoteName: ticker.BaseAssetName,
          quoteVolume: parseToFloat(ticker.BaseVolume),
          baseVolume: parseToFloat(ticker.Volume),
          high: parseToFloat(ticker.High),
          low: parseToFloat(ticker.Low),
          close: parseToFloat(ticker.Last),
        });
      });
  }
}

module.exports = Bleutrade;
