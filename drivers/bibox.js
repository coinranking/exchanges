const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils');

/**
 * @memberof Driver
 * @augments Driver
 */
class Bibox extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const data = await request('https://api.bibox.com/v1/mdata?cmd=marketAll');
    const tickers = data.result;

    return tickers
      .filter((ticker) => ticker.is_hide === 0)
      .filter((ticker) => ticker.pair_type === 0)
      .map((ticker) => {
        const base = ticker.coin_symbol;
        const quote = ticker.currency_symbol;

        return new Ticker({
          base,
          quote,
          quoteVolume: parseToFloat(ticker.amount),
          baseVolume: parseToFloat(ticker.vol24H),
          close: parseToFloat(ticker.last),
          high: parseToFloat(ticker.high),
          low: parseToFloat(ticker.low),
        });
      });
  }
}

module.exports = Bibox;
