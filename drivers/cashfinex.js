const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

/**
 * @memberof Driver
 * @augments Driver
 */
class Cashfinex extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const { tradeStats: tickers } = await request({
      url: 'https://api.cashfinex.com/api/trades/tradeStats',
      headers: { Accept: 'application/json' },
      rejectUnauthorized: false,
    });

    return tickers.map((ticker) => {
      const [base, quote] = ticker.pair.split('/');

      return new Ticker({
        base,
        quote,
        open: parseToFloat(ticker.first),
        high: parseToFloat(ticker.High),
        low: parseToFloat(ticker.Low),
        close: parseToFloat(ticker.Last),
        baseVolume: parseToFloat(ticker.amount),
        quoteVolume: parseToFloat(ticker.Volume),
      });
    });
  }
}

module.exports = Cashfinex;
