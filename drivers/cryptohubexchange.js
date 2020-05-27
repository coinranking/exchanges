const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

/**
 * @memberof Driver
 * @augments Driver
 */
class Cryptohubexchange extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const markets = await request('https://cryptohubexchange.com/api/market/ticker/');

    return Object.keys(markets).map((market) => {
      const [quote, base] = market.split('_'); // they reversed base with quote
      const ticker = markets[market];

      return new Ticker({
        base,
        quote,
        high: parseToFloat(ticker.high24hr),
        low: parseToFloat(ticker.low24hr),
        close: parseToFloat(ticker.last),
        bid: parseToFloat(ticker.highestBid),
        ask: parseToFloat(ticker.lowestAsk),
        baseVolume: parseToFloat(ticker.quoteVolume), // they reversed baseVolume with quoteVolume
        quoteVolume: parseToFloat(ticker.baseVolume),
      });
    });
  }
}

module.exports = Cryptohubexchange;
