const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils');

/**
 * @memberof Driver
 * @augments Driver
 */
class Bitbay extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const { items } = await request('https://api.bitbay.net/rest/trading/ticker');
    const markets = Object.keys(items);

    const tickers = markets.map(async (market) => {
      const [base, quote] = market.split('-');
      const ticker = await request(`https://bitbay.net/API/Public/${base}${quote}/ticker.json`);

      return new Ticker({
        base,
        quote,
        baseVolume: parseToFloat(ticker.volume),
        close: parseToFloat(ticker.last),
        high: parseToFloat(ticker.max),
        low: parseToFloat(ticker.min),
        vwap: parseToFloat(ticker.vwap),
      });
    });

    return Promise.all(tickers);
  }
}

module.exports = Bitbay;
