const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils');

/**
 * @memberof Driver
 * @augments Driver
 */
class Triunits extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const tickers = await request('https://fapi.triunits.com/spot/ticker/24hr');

    return tickers.map((ticker) => {
      const pairs = /^([A-Z]*)(BNB|BTC|ETH|XRP|USDT|PAX|TUSD|USDC|USDS|INR)$/.exec(ticker.symbol);
      if (!pairs) return undefined;
      const [, base, quote] = pairs;

      return new Ticker({
        base,
        quote,
        quoteVolume: parseToFloat(ticker.quoteVolume),
        baseVolume: parseToFloat(ticker.volume),
        close: parseToFloat(ticker.lastPrice),
        open: parseToFloat(ticker.openPrice),
        high: parseToFloat(ticker.highPrice),
        low: parseToFloat(ticker.lowPrice),
        vwap: parseToFloat(ticker.weightedAvgPrice),
        ask: parseToFloat(ticker.askPrice),
        bid: parseToFloat(ticker.bidPrice),
      });
    });
  }
}

module.exports = Triunits;
