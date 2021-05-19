const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils');

/**
 * @memberof Driver
 * @augments Driver
 */
class Etherflyer extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const data = await request('https://open.etherflyer.com/market/allticker');
    const tickers = data.ticker;

    return tickers
      .filter((ticker) => typeof ticker.symbol !== 'undefined')
      .map((ticker) => {
        const [base, quote] = ticker.symbol.split('_');

        return new Ticker({
          base,
          quote,
          close: parseToFloat(ticker.last),
          baseVolume: parseToFloat(ticker.volume),
          open: parseToFloat(ticker.open),
          high: parseToFloat(ticker.high),
          low: parseToFloat(ticker.low),
        });
      });
  }
}

module.exports = Etherflyer;
