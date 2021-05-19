const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils');

/**
 * @memberof Driver
 * @augments Driver
 */
class Ftx extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const { result } = await request('https://ftx.com/api/markets');
    const tickers = result.filter((item) => item.type === 'spot');

    return tickers.map((ticker) => {
      const [base, quote] = ticker.name.split('/');

      return new Ticker({
        base,
        quote,
        close: parseToFloat(ticker.last),
        bid: parseToFloat(ticker.bid),
        ask: parseToFloat(ticker.ask),
        quoteVolume: parseToFloat(ticker.quoteVolume24h),
      });
    });
  }
}

module.exports = Ftx;
