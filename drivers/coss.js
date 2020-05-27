const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

/**
 * @memberof Driver
 * @augments Driver
 */
class Coss extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const { result: tickers } = await request('https://trade.coss.io/v1/getmarketsummaries');

    return tickers.map((ticker) => {
      const [base, quote] = ticker.MarketName.split('-');

      // Warning: COSS inverts base and quote

      return new Ticker({
        base,
        quote,
        baseVolume: parseToFloat(ticker.Volume),
        quoteVolume: parseToFloat(ticker.BaseVolume),
        high: parseToFloat(ticker.High),
        low: parseToFloat(ticker.Low),
        close: parseToFloat(ticker.Last),
      });
    });
  }
}

module.exports = Coss;
