const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

/**
 * @memberof Driver
 * @augments Driver
 */
class Exscudo extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const { payload: tickers } = await request('https://my.exscudo.com/api/v1/tickers');
    const { payload: symbols } = await request('https://my.exscudo.com/api/v1/symbols/details');

    return tickers.map((ticker) => {
      const symbolDetails = symbols.find((item) => item.symbol === ticker.symbol);

      if (!symbolDetails) {
        return undefined;
      }

      const { base, quote } = symbolDetails;

      return new Ticker({
        base,
        quote,
        high: parseToFloat(ticker.high),
        low: parseToFloat(ticker.low),
        close: parseToFloat(ticker.lastPrice),
        open: parseToFloat(ticker.openPrice),
        bid: parseToFloat(ticker.bid),
        ask: parseToFloat(ticker.ask),
        baseVolume: parseToFloat(ticker.rolling24HoursVolume),
        quoteVolume: parseToFloat(ticker.rolling24HoursQuoteVolume),
      });
    });
  }
}

module.exports = Exscudo;
