const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils');

/**
 * @memberof Driver
 * @augments Driver
 */
class Icpswap extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const markets = await request('https://uvevg-iyaaa-aaaak-ac27q-cai.raw.ic0.app/tickers');

    return Object.keys(markets).flatMap((market) => {
      const ticker = markets[market];
      const close = 1 / parseToFloat(ticker.last_price);
      const baseVolume = parseToFloat(ticker.base_volume_24H);
      const quoteVolume = parseToFloat(ticker.target_volume_24H);

      if (!close) return [];
      if (!baseVolume && !quoteVolume) return [];

      return new Ticker({
        base: ticker.base_currency,
        quote: ticker.target_currency,
        baseReference: ticker.base_id,
        quoteReference: ticker.target_id,
        close,
        baseVolume: parseToFloat(ticker.base_volume_24H),
        quoteVolume: parseToFloat(ticker.target_volume_24H),
      });
    });
  }
}

module.exports = Icpswap;
