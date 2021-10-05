const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils');

/**
 * @memberof Driver
 * @augments Driver
 */
class Cex extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const quotes = ['USD', 'ETH', 'BTC', 'USDT', 'GBP', 'EUR'];
    const { data: tickers } = await request(`https://cex.io/api/tickers/${quotes.join('/')}`);

    return tickers.map((ticker) => {
      const [base, quote] = ticker.pair.split(':');

      return new Ticker({
        base,
        quote,
        baseVolume: parseToFloat(ticker.volume),
        high: parseToFloat(ticker.high),
        low: parseToFloat(ticker.low),
        close: parseToFloat(ticker.last),
      });
    });
  }
}

module.exports = Cex;
