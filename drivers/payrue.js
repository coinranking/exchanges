const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

/**
 * @memberof Driver
 * @augments Driver
 */
class Payrue extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const { pairs: tickers } = await request(
      'https://payrue.com:8090/api/v1/public/volumes',
    );

    return tickers.map((ticker) => {
      const [quote, base] = ticker.symbol.split('/');

      return new Ticker({
        base,
        quote,
        close: parseToFloat(ticker.price),
        baseVolume: parseToFloat(ticker.quote_volume), // reversed with base volume
        quoteVolume: parseToFloat(ticker.base_volume),
      });
    });
  }
}

module.exports = Payrue;
