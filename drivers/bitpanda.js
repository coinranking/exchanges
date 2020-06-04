const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

/**
 * @memberof Driver
 * @augments Driver
 */
class Bitpanda extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const tickers = await request('https://api.exchange.bitpanda.com/public/v1/market-ticker');

    return tickers
      .filter((ticker) => (ticker.state === 'ACTIVE'))
      .map((ticker) => {
        const [base, quote] = ticker.instrument_code.split('_');

        return new Ticker({
          base,
          quote,
          quoteVolume: parseToFloat(ticker.quote_volume),
          high: parseToFloat(ticker.high),
          low: parseToFloat(ticker.low),
          close: parseToFloat(ticker.last_price),
        });
      });
  }
}

module.exports = Bitpanda;
