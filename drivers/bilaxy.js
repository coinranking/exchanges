const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils');

/**
 * @memberof Driver
 * @augments Driver
 */
class Bilaxy extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const markets = await request('https://newapi.bilaxy.com/v1/ticker/24hr');

    return Object.keys(markets).map((market) => {
      const ticker = markets[market];

      if (!ticker.trade_enabled) {
        return undefined;
      }

      const [base, quote] = market.split('_');

      return new Ticker({
        base,
        quote,
        open: parseToFloat(ticker.open),
        high: parseToFloat(ticker.height),
        low: parseToFloat(ticker.low),
        close: parseToFloat(ticker.close),
        baseVolume: parseToFloat(ticker.base_volume),
        quoteVolume: parseToFloat(ticker.quote_volume),
      });
    });
  }
}

module.exports = Bilaxy;
