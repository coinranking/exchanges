const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils');

/**
 * @memberof Driver
 * @augments Driver
 */
class Tchapp extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const tickers = await request('https://api.thorecash.app/api/public/tradeInstruments');

    return tickers.map((ticker) => {
      const base = ticker.baseCurrency;
      const quote = ticker.quoteCurrency;

      return new Ticker({
        base,
        quote,
        baseVolume: parseToFloat(ticker['Volume (24H)'].replace(',', '')),
        close: parseToFloat(ticker.Lastprice.replace(',', '')),
      });
    });
  }
}

module.exports = Tchapp;
