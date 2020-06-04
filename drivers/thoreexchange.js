const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

/**
 * @memberof Driver
 * @augments Driver
 */
class Thoreexchange extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const tickers = await request('https://thoreexchange.com/api/public/tradeInstruments');

    return tickers
      .filter((ticker) => (ticker.state === 'active'))
      .map((ticker) => {
        const [base, quote] = ticker.symbol.split('-');
        const volume = ticker['Volume (24H)'].replace(',', '');
        const price = ticker.Lastprice.replace(',', '');

        return new Ticker({
          base,
          quote,
          baseVolume: parseToFloat(volume),
          close: parseToFloat(price),
        });
      });
  }
}

module.exports = Thoreexchange;
