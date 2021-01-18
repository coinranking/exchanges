const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

/**
 * @memberof Driver
 * @augments Driver
 */
class Sperocoin extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const tickers = await request('https://exchange.sperocoin.org/api/v2/tickers.json');
    const markets = await request('https://exchange.sperocoin.org:443/api/v2/markets.json');

    return markets.map((market) => {
      const [base, quote] = market.name.split('/');
      const { ticker } = tickers[market.id];

      return new Ticker({
        base,
        quote,
        high: parseToFloat(ticker.high),
        low: parseToFloat(ticker.low),
        close: parseToFloat(ticker.last),
        bid: parseToFloat(ticker.buy),
        ask: parseToFloat(ticker.sell),
        baseVolume: parseToFloat(ticker.vol),
      });
    });
  }
}

module.exports = Sperocoin;
