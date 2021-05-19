const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils');

/**
 * @memberof Driver
 * @augments Driver
 */
class Kraken extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const marketData = await request('https://api.kraken.com/0/public/AssetPairs');
    const markets = marketData.result;
    const pairs = Object.keys(marketData.result);

    const tickerData = await request(`https://api.kraken.com/0/public/Ticker?pair=${pairs.join(',')}`);
    const tickers = tickerData.result;

    return pairs.map((pair) => {
      const ticker = tickers[pair];
      if (!ticker) return undefined;

      const market = markets[pair];
      if (!market) return undefined;

      const [base, quote] = market.wsname.split('/');

      return new Ticker({
        base,
        quote,
        baseVolume: parseToFloat(ticker.v[1]),
        close: parseToFloat(ticker.c[0]),
        high: parseToFloat(ticker.h[1]),
        low: parseToFloat(ticker.l[1]),
      });
    });
  }
}

module.exports = Kraken;
