const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils');

/**
 * @memberof Driver
 * @augments Driver
 */
class Coineal extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const { data: markets } = await request('https://exchange-open-api.coineal.com/open/api/common/symbols');

    const tickers = markets.map(async (market) => {
      try {
        const result = await request(`https://exchange-open-api.coineal.com/open/api/get_ticker?symbol=${market.base_coin}${market.count_coin}`);
        const ticker = result.data;

        const base = market.base_coin;
        const quote = market.count_coin;

        return new Ticker({
          base,
          quote,
          baseVolume: parseToFloat(ticker.vol),
          high: parseToFloat(ticker.high),
          low: parseToFloat(ticker.low),
          close: parseToFloat(ticker.last),
        });
      } catch (e) {
        return undefined;
      }
    });

    return Promise.all(tickers);
  }
}

module.exports = Coineal;
