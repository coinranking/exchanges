const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

/**
 * @memberof Driver
 * @augments Driver
 */
class Switcheo extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const tickers = await request('https://api.switcheo.network/v2/tickers/last_24_hours');

    return tickers.map((ticker) => {
      const [base, quote] = ticker.pair.split('_');

      // Warning: Switcheo inverts base and quote volume
      return new Ticker({
        base,
        quote,
        baseVolume: parseToFloat(ticker.quote_volume),
        quoteVolume: parseToFloat(ticker.volume),
        open: parseToFloat(ticker.open),
        high: parseToFloat(ticker.high),
        low: parseToFloat(ticker.low),
        close: parseToFloat(ticker.close),
      });
    });
  }
}

module.exports = Switcheo;
