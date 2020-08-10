const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat, isUndefined } = require('../lib/utils.js');

/**
 * @memberof Driver
 * @augments Driver
 */
class Virtuse extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const tickers = await request({
      url: 'https://virtuse.exchange/api/v1',
      method: 'post',
      form: {
        method: 'public/get_ticker',
      },
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return Object.values(tickers).map((ticker) => {
      const { base: baseVolume, quote: quoteVolume } = ticker.volume;

      if (isUndefined(ticker.base)) return undefined;
      if (isUndefined(ticker.quote)) return undefined;

      return new Ticker({
        base: ticker.base,
        quote: ticker.quote,
        high: parseToFloat(ticker.high),
        low: parseToFloat(ticker.low),
        close: parseToFloat(ticker.last),
        baseVolume: parseToFloat(baseVolume),
        quoteVolume: parseToFloat(quoteVolume),
      });
    });
  }
}

module.exports = Virtuse;
