const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils');

/**
 * @memberof Driver
 * @augments Driver
 */
class Rightbtc extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const pairsResult = await request('https://rightbtc.com/api/public/trading_pairs');
    const pairs = Object.values(pairsResult);

    const { result: tickers } = await request('https://rightbtc.com/api/public/tickers');

    return pairs.map((pair) => {
      const base = pair.bid_asset_symbol;
      const quote = pair.ask_asset_symbol;

      const ticker = tickers.find((item) => item.market === pair.name);
      if (!ticker) return undefined;

      // Convert to the correct amount of decimals
      return new Ticker({
        base,
        quote,
        baseVolume: parseToFloat(ticker.vol, (number) => number / 1e8),
        close: parseToFloat(ticker.last, (number) => number / 1e8),
        high: parseToFloat(ticker.high, (number) => number / 1e8),
        low: parseToFloat(ticker.low, (number) => number / 1e8),
      });
    });
  }
}

module.exports = Rightbtc;
