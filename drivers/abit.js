const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat, flatMap } = require('../lib/utils.js');

/**
 * @memberof Driver
 * @augments Driver
 */
class Abit extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const { data: tickers } = await request('https://api.abit.com/v1/ifmarket/spotTickers');

    return flatMap(tickers, (ticker) => {
      const [base, quote] = ticker.stock_code.split('/');

      return new Ticker({
        base,
        quote,
        high: parseToFloat(ticker.high),
        low: parseToFloat(ticker.low),
        close: parseToFloat(ticker.last_price),
        baseVolume: parseToFloat(ticker.total_volume),
      });
    });
  }
}

module.exports = Abit;
