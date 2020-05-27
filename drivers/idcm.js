const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

/**
 * @memberof Driver
 * @augments Driver
 */
class Idcm extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const { Data: tickers } = await request('http://api.idcm.io:8303/api/v1/RealTimeQuote/GetRealTimeQuotes');

    return tickers.map((ticker) => {
      const [base, quote] = ticker.TradePairCode.split('/');

      return new Ticker({
        base,
        quote,
        high: parseToFloat(ticker.High),
        low: parseToFloat(ticker.Low),
        close: parseToFloat(ticker.Close),
        baseVolume: parseToFloat(ticker.Volume),
      });
    });
  }
}

module.exports = Idcm;
