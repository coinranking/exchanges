const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

/**
 * @memberof Driver
 * @augments Driver
 */
class Lykke extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const tickers = await request('https://public-api.lykke.com/api/Market');

    return tickers.map((ticker) => {
      const pair = /^([A-Z0-9a-z]*)(ETH|GBP|BTC|CHF|USD|DKK|EUR|HKD|CZK|JPY|SEK|CAD|SGD)$/.exec(ticker.assetPair);
      if (!pair) return undefined;
      const [, base, quote] = pair;

      return new Ticker({
        base,
        quote,
        quoteVolume: parseToFloat(ticker.volume24H),
        close: parseToFloat(ticker.lastPrice),
      });
    });
  }
}

module.exports = Lykke;
