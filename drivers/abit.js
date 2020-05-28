const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat, flatMap } = require('../lib/utils.js');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;

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
    const { data: { tickers } } = await request('https://api.abit.com/spot/tickers');

    return flatMap(tickers, (ticker) => {
      const [base, quote] = ticker.symbol.split('/');

      return new Ticker({
        base,
        quote,
        high: parseToFloat(ticker.high),
        low: parseToFloat(ticker.low),
        close: parseToFloat(ticker.close),
        baseVolume: parseToFloat(ticker.qty24),
        quoteVolume: parseToFloat(ticker.amount24),
      });
    });
  }
}

module.exports = Abit;
