const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils');

/**
 * @memberof Driver
 * @augments Driver
 */
class Bitbank extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const pairs = ['btc_jpy', 'xrp_jpy', 'ltc_btc', 'eth_btc', 'mona_jpy', 'mona_btc', 'bcc_jpy', 'bcc_btc'];

    const tickers = pairs.map(async (pair) => {
      const result = await request(`https://public.bitbank.cc/${pair}/ticker`);
      const ticker = result.data;

      const [base, quote] = pair.split('_');

      return new Ticker({
        base,
        quote,
        baseVolume: parseToFloat(ticker.vol),
        close: parseToFloat(ticker.last),
        high: parseToFloat(ticker.high),
        low: parseToFloat(ticker.low),
      });
    });

    return Promise.all(tickers);
  }
}

module.exports = Bitbank;
