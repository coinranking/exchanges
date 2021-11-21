const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils');

/**
 * @memberof Driver
 * @augments Driver
 */
class Exbitron extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const { data: { markets: tickers } } = await request('https://www.exbitron.com/api/v2/peatio/coingecko/tickers');

    return tickers.map((ticker) => {
      const [base, quote] = ticker.ticker_id.split('_');

      return new Ticker({
        base,
        quote,
        base: ticker.base_currency,
        quote: ticker.target_currency,
        high: parseToFloat(ticker.high),
        low: parseToFloat(ticker.low),
        close: parseToFloat(ticker.last_price),
        bid: parseToFloat(ticker.bid),
        ask: parseToFloat(ticker.ask),
        baseVolume: parseToFloat(ticker.base_volume),
        quoteVolume: parseToFloat(ticker.target_volume),
      });
    });
  }
}

module.exports = Exbitron;
