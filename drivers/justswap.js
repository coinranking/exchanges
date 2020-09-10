const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat, flatMap } = require('../lib/utils');

/**
 * @memberof Driver
 * @augments Driver
 */
class Justswap extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const { total_num: total } = await request('https://api.justswap.io/v2/allpairs?page_size=50&page_num=0');

    const indexes = Math.floor(total / 50) + (total % 50 === 0 ? 0 : 1);
    const all = Array.from(new Array(indexes), () => 1);

    return flatMap(all, async (item, index) => {
      const { data } = await request(`https://api.justswap.io/v2/allpairs?page_size=50&page_num=${index}`);

      return Object.values(data).map((ticker) => new Ticker({
        base: ticker.base_symbol,
        baseName: ticker.base_name,
        baseReference: ticker.base_id,
        quote: ticker.quote_symbol,
        quoteName: ticker.quote_name,
        quoteReference: ticker.quote_id,
        close: parseToFloat(ticker.price),
        baseVolume: parseToFloat(ticker.base_volume) / 10 ** 6,
        quoteVolume: parseToFloat(ticker.quote_volume) / 10 ** 6,
      }));
    });
  }
}

module.exports = Justswap;
