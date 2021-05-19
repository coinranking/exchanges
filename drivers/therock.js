const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils');

/**
 * @memberof Driver
 * @augments Driver
 */
class Therock extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const { tickers } = await request('https://api.therocktrading.com/v1/funds/tickers');

    return tickers.map((ticker) => {
      const pairs = /^([A-Z]*)(EUR|BTC|XRP|ETH|USD)$/.exec(ticker.fund_id);
      if (!pairs) return undefined;
      const [, base, quote] = pairs;

      return new Ticker({
        base,
        quote,
        baseVolume: parseToFloat(ticker.volume_traded),
        quoteVolume: parseToFloat(ticker.volume),
        open: parseToFloat(ticker.open),
        high: parseToFloat(ticker.high),
        low: parseToFloat(ticker.low),
        close: parseToFloat(ticker.close),
      });
    });
  }
}

module.exports = Therock;
