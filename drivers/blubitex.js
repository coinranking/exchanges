const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils');

/**
 * @memberof Driver
 * @augments Driver
 */
class Blubitex extends Driver {
  constructor() {
    super({
      requires: {
        key: true,
      },
    });
  }

  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const data = await request({
      url: 'https://api.blubitex.com/api/v1/home/landing',
      headers: {
        Authorization: `Basic ${this.key}`,
      },
    });

    const tickers = data.res_data.volume.flat();

    return tickers.map((ticker) => {
      const [base, quote] = ticker.coin.split('/');

      return new Ticker({
        base,
        baseName: ticker.coinName,
        quote,
        quoteName: ticker.coinNameSec,
        high: parseToFloat(ticker.high),
        low: parseToFloat(ticker.low),
        close: parseToFloat(ticker.price.price),
        baseVolume: typeof ticker.amount === 'number' ? ticker.amount : parseToFloat(ticker.amount),
        // Typo in volume is on purpose as that's what it's called in the response.
        quoteVolume: typeof ticker.valume === 'number' ? ticker.valume : parseToFloat(ticker.valume),
      });
    });
  }
}

module.exports = Blubitex;
