const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils');

/**
 * @memberof Driver
 * @augments Driver
 */
class Nami extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const { data: tickers } = await request(
      'https://nami.exchange/api/v1.0/market/summaries',
    );

    return tickers.map((ticker) => {
      const { exchange_currency: base, base_currency: quote } = ticker;

      return new Ticker({
        base,
        quote,
        high: parseToFloat(ticker.high_24h),
        low: parseToFloat(ticker.low_24h),
        close: parseToFloat(ticker.last_price),
        baseVolume: parseToFloat(ticker.total_exchange_volume),
        quoteVolume: parseToFloat(ticker.total_base_volume),
      });
    });
  }
}

module.exports = Nami;
