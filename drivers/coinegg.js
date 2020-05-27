const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { flatMap, parseToFloat } = require('../lib/utils');

/**
 * @memberof Driver
 * @augments Driver
 */
class Coinegg extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const quotes = ['btc', 'eth', 'usc', 'usdt'];

    return flatMap(quotes, async (quote) => {
      const { data: tickers } = await request(`https://trade.coinegg.com/web/symbol/ticker?right_coin=${quote}`);

      return tickers.map((ticker) => {
        const base = ticker.coin;

        return new Ticker({
          base,
          quote,
          baseVolume: parseToFloat(ticker.amount),
          quoteVolume: parseToFloat(ticker.vol),
          high: parseToFloat(ticker.high),
          low: parseToFloat(ticker.low),
          close: parseToFloat(ticker.price),
        });
      });
    });
  }
}

module.exports = Coinegg;
