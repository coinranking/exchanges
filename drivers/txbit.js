const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

/**
 * @memberof Driver
 * @augments Driver
 */
class Txbit extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const { result } = await request('https://api.txbit.io/api/public/getmarketsummaries');

    return result.map((ticker) => {
      const [base, quote] = ticker.MarketName.split('/');
      const [baseName, quoteName] = ticker.DisplayMarketName.split('-');

      return new Ticker({
        base,
        baseName: baseName.trim(),
        quote,
        quoteName: quoteName.trim(),
        high: parseToFloat(ticker.High),
        low: parseToFloat(ticker.Low),
        close: parseToFloat(ticker.Last),
        bid: parseToFloat(ticker.Bid),
        ask: parseToFloat(ticker.Ask),
        baseVolume: parseToFloat(ticker.Volume), // reversed with quote volume
        quoteVolume: parseToFloat(ticker.BaseVolume),
      });
    });
  }
}

module.exports = Txbit;
