const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils');

/**
 * @memberof Driver
 * @augments Driver
 */
class Luno extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const { tickers } = await request('https://api.mybitx.com/api/1/tickers');

    return tickers
      .filter((ticker) => (ticker.status === 'ACTIVE'))
      .map((ticker) => {
        const pairs = /^([A-Z]*)(MYR|NGN|ZMW|XBT|ZAR|EUR|IDR)$/.exec(ticker.pair);
        if (!pairs) return undefined;
        const [, base, quote] = pairs;

        return new Ticker({
          base,
          quote,
          baseVolume: parseToFloat(ticker.rolling_24_hour_volume),
          close: parseToFloat(ticker.last_trade),
        });
      });
  }
}

module.exports = Luno;
