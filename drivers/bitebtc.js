const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils');

/**
 * @memberof Driver
 * @augments Driver
 */
class Bitebtc extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const data = await request('https://bitebtc.com/api/v1/market');
    const tickers = data.result;

    return tickers.map((ticker) => {
      const [base, quote] = ticker.market.split('_');

      return new Ticker({
        base,
        quote,
        quoteVolume: parseToFloat(ticker.base_volume),
        baseVolume: parseToFloat(ticker.volume),
        close: parseToFloat(ticker.close),
        open: parseToFloat(ticker.open),
        high: parseToFloat(ticker.high),
        low: parseToFloat(ticker.low),
        vwap: parseToFloat(ticker.average),
      });
    });
  }
}

module.exports = Bitebtc;
