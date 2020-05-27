const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { flatMap, parseToFloat } = require('../lib/utils');

/**
 * @memberof Driver
 * @augments Driver
 */
class Bitinka extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const data = await request('https://www.bitinka.com/api/apinka/ticker?format=json');
    const currencies = Object.keys(data);

    return flatMap(currencies, async (currency) => {
      const tickers = Object.values(data[currency]);

      return tickers.map((ticker) => {
        const [base, quote] = ticker.symbol.split('_');

        return new Ticker({
          base,
          quote,
          // 'volumen' yes I know, this is not a typo :)
          baseVolume: parseToFloat(ticker.volumen24hours),
          close: parseToFloat(ticker.lastPrice),
        });
      });
    });
  }
}

module.exports = Bitinka;
