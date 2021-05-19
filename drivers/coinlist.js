const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils');

/**
 * @memberof Driver
 * @augments Driver
 */
class Coinlist extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const tickers = await request('https://trade-api.coinlist.co/v1/symbols/summary');
    const markets = Object.keys(tickers);

    return markets.map((market) => {
      const ticker = tickers[market];
      const [base, quote] = market.split('-');

      if (ticker.type !== 'spot') return undefined;

      return new Ticker({
        base,
        quote,
        high: parseToFloat(ticker.highest_price_24h),
        low: parseToFloat(ticker.lowest_price_24h),
        close: parseToFloat(ticker.last_price),
        bid: parseToFloat(ticker.highest_bid),
        ask: parseToFloat(ticker.lowest_ask),
        baseVolume: parseToFloat(ticker.volume_base_24h),
        quoteVolume: parseToFloat(ticker.volume_quote_24h),
      });
    });
  }
}

module.exports = Coinlist;
