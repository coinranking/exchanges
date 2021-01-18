const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

/**
 * @memberof Driver
 * @augments Driver
 */
class Gateio extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const tickers = await request('https://api.gateio.ws/api/v4/spot/tickers');

    return tickers.map((ticker) => {
      const [base, quote] = ticker.currency_pair.split('_');

      // Yes, quoteVolume and baseVolume are switched :)
      return new Ticker({
        base,
        quote,
        high: parseToFloat(ticker.high_24h),
        low: parseToFloat(ticker.low_24h),
        close: parseToFloat(ticker.last),
        bid: parseToFloat(ticker.highest_bid),
        ask: parseToFloat(ticker.lowest_ask),
        baseVolume: parseToFloat(ticker.base_volume),
        quoteVolume: parseToFloat(ticker.quote_volume),
      });
    });
  }
}

module.exports = Gateio;
