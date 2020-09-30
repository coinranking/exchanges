const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

/**
 * @memberof Driver
 * @augments Driver
 */
class Fides extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const { data: markets } = await request('https://node1.fides-ex.com/market/get-market-summary');

    return Object.keys(markets).map((market) => {
      const [quote, base] = market.split('_');
      const ticker = markets[market];

      return new Ticker({
        base,
        quote,
        high: parseToFloat(ticker.High_24hr),
        low: parseToFloat(ticker.Low_24hr),
        close: parseToFloat(ticker.Last),
        bid: parseToFloat(ticker.HeighestBid),
        ask: parseToFloat(ticker.LowestAsk),
        baseVolume: parseToFloat(ticker.QuoteVolume),
        quoteVolume: parseToFloat(ticker.BaseVolume),
      });
    });
  }
}

module.exports = Fides;
