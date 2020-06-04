const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

/**
 * @memberof Driver
 * @augments Driver
 */
class Coinex extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const { data } = await request('https://api.coinex.com/v1/market/ticker/all');
    const tickers = data.ticker;
    const markets = Object.keys(tickers);

    return markets.map((market) => {
      const pair = /^([A-Z]*)(ETH|BCH|BTC|USDC|USDT|PAX)$/.exec(market);
      if (!pair) return undefined;
      const [, base, quote] = pair;
      const ticker = tickers[market];

      return new Ticker({
        base,
        quote,
        baseVolume: parseToFloat(ticker.vol),
        close: parseToFloat(ticker.last),
        open: parseToFloat(ticker.open),
        high: parseToFloat(ticker.high),
        low: parseToFloat(ticker.low),
      });
    });
  }
}

module.exports = Coinex;
