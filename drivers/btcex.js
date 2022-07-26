const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils');

/**
 * @memberof Driver
 * @augments Driver
 */
class Btcex extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const { result: tickers } = await request('https://www.btcex.com/api/v1/public/cmc_spot_summary');

    return tickers.map((ticker) => {
      const [base, quote] = ticker.trading_pairs.split('-');

      return new Ticker({
        base,
        quote,
        high: parseToFloat(ticker.highest_price_24h),
        low: parseToFloat(ticker.lowest_price_24h),
        close: parseToFloat(ticker.last_price),
        baseVolume: parseToFloat(ticker.base_volume),
        quoteVolume: parseToFloat(ticker.quote_volume),
        bid: parseToFloat(ticker.highest_bid),
        ask: parseToFloat(ticker.lowest_ask),
      });
    });
  }
}

module.exports = Btcex;
