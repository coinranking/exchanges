const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils');

/**
 * @memberof Driver
 * @augments Driver
 */
class Doggy extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const { data: tickers } = await request('https://api.doggy.market/token/trending?period=24h&limit=100');

    return tickers.map((ticker) => {
      const base = ticker.tick;
      const quote = 'DOGE';

      return new Ticker({
        base,
        baseReference: ticker.inscriptionId,
        quote,
        quoteVolume: parseToFloat(ticker.volume24h / 100000000),
        open: parseToFloat(ticker.firstPrice / 100000000),
        close: parseToFloat(ticker.lastPrice / 100000000),
      });
    });
  }
}

module.exports = Doggy;
