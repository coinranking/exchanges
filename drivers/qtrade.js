const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

/**
 * @memberof Driver
 * @augments Driver
 */
class Qtrade extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const { data: { markets: tickers } } = await request('https://api.qtrade.io/v1/tickers');

    return tickers.map((ticker) => {
      const [base, quote] = ticker.id_hr.split('_');

      return new Ticker({
        base,
        quote,
        high: parseToFloat(ticker.day_high),
        low: parseToFloat(ticker.day_low),
        close: parseToFloat(ticker.last),
        bid: parseToFloat(ticker.bid),
        ask: parseToFloat(ticker.ask),
        baseVolume: parseToFloat(ticker.day_volume_market), // reversed
        quoteVolume: parseToFloat(ticker.day_volume_base),
      });
    });
  }
}

module.exports = Qtrade;
