const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

/**
 * @memberof Driver
 * @augments Driver
 */
class OreBz extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const { Data: markets } = await request('https://ore.bz/public/ticker');

    return Object.keys(markets).map((market) => {
      const [quote, base] = market.split('_'); // base and quote are reversed
      const ticker = markets[market];

      return new Ticker({
        base,
        quote,
        high: parseToFloat(ticker.high24hr),
        low: parseToFloat(ticker.low24hr),
        close: parseToFloat(ticker.last),
        bid: parseToFloat(ticker.lowestAskBid),
        ask: parseToFloat(ticker.highestBid),
        baseVolume: parseToFloat(ticker.quoteVolume), // base and quote volume are reversed
        quoteVolume: parseToFloat(ticker.baseVolume),
      });
    });
  }
}

module.exports = OreBz;
