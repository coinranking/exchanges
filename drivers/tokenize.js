const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils');

/**
 * @memberof Driver
 * @augments Driver
 */
class Tokenize extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const { data: tickers } = await request('https://api2.tokenize.exchange/public/v1/market/get-summaries');

    return tickers.map((ticker) => {
      const [quote, base] = ticker.market.split('-');

      return new Ticker({
        base,
        quote,
        high: parseToFloat(ticker.high),
        low: parseToFloat(ticker.low),
        close: parseToFloat(ticker.lastPrice),
        bid: parseToFloat(ticker.bidPrice),
        ask: parseToFloat(ticker.askPrice),
        quoteVolume: parseToFloat(ticker.volume),
      });
    });
  }
}

module.exports = Tokenize;
