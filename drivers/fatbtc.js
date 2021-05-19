const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils');

/**
 * @memberof Driver
 * @augments Driver
 */
class Fatbtc extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const result = await request('https://www.fatbtc.us/m/allticker/1');
    const { data } = result;
    const tickers = Object.values(data);

    return tickers.map((ticker) => {
      const [base, quote] = ticker.dspName.split('/');

      return new Ticker({
        base,
        quote,
        open: parseToFloat(ticker.open),
        high: parseToFloat(ticker.high),
        low: parseToFloat(ticker.low),
        close: parseToFloat(ticker.close),
        baseVolume: parseToFloat(ticker.volume),
        quoteVolume: parseToFloat(ticker.amount),
      });
    });
  }
}

module.exports = Fatbtc;
