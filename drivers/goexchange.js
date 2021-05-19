const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils');

/**
 * @memberof Driver
 * @augments Driver
 */
class Goexchange extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const { result: symbols } = await request('https://api.go.exchange/exchange/symbols');
    const { result: tickers } = await request('https://api.go.exchange/exchange/ticker');

    return symbols.map((symbol) => {
      const base = symbol.base_currency_code;
      const quote = symbol.quote_currency_code;
      const ticker = tickers.find((item) => (item.symbol === symbol.name));

      return new Ticker({
        base,
        quote,
        quoteVolume: parseToFloat(ticker.volume_24h),
        close: parseToFloat(ticker.last_price),
      });
    });
  }
}

module.exports = Goexchange;
