const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

/**
 * @memberof Driver
 * @augments Driver
 */
class Localbitcoins extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const tickers = await request('https://localbitcoins.com/bitcoinaverage/ticker-all-currencies/');
    const quotes = Object.keys(tickers);

    return quotes.map((quote) => {
      const base = 'BTC';
      const ticker = tickers[quote];

      return new Ticker({
        base,
        quote,
        baseVolume: parseToFloat(ticker.volume_btc),
        close: parseToFloat(ticker.rates.last),
        vwap: parseToFloat(ticker.avg_24h),
      });
    });
  }
}

module.exports = Localbitcoins;
