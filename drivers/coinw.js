const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils');

/**
 * @memberof Driver
 * @augments Driver
 */
class Coinw extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const { data: tickers } = await request('https://api.coinw.com/api/v1/public?command=returnTicker');
    const pairs = Object.keys(tickers);

    return pairs.map((pair) => {
      const [base, quote] = pair.split('_');
      const ticker = tickers[pair];

      return new Ticker({
        base,
        quote,
        bid: parseToFloat(ticker.highestBid),
        ask: parseToFloat(ticker.lowestAsk),
        quoteVolume: parseToFloat(ticker.baseVolume), // They flipped it compared to Forex
        high: parseToFloat(ticker.high24hr),
        low: parseToFloat(ticker.low24hr),
        close: parseToFloat(ticker.last),
      });
    });
  }
}

module.exports = Coinw;
