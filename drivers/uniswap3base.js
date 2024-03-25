const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils');

/**
 * @memberof Driver
 * @augments Driver
 */
class Uniswap3base extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const { data } = await request('https://api.geckoterminal.com/api/v2/networks/base/dexes/uniswap-v3-base/pools?page=1&sort=h24_volume_usd_desc');

    return Object.keys(data).map((market) => {
      const ticker = data[market];
      const base = ticker.relationships.base_token.data.id.split('base_')[1];
      const quote = ticker.relationships.quote_token.data.id.split('base_')[1];

      const usdVolume = ticker.attributes.volume_usd.h24;
      const usdBasePrice = ticker.attributes.base_token_price_usd;
      const usdQuotePrice = ticker.attributes.base_token_price_usd;
      const baseVolume = usdVolume * usdBasePrice;
      const quoteVolume = usdVolume * usdQuotePrice;

      return new Ticker({
        base,
        quote,
        close: parseToFloat(ticker.attributes.base_token_price_native_currency),
        baseVolume: parseToFloat(baseVolume),
        quoteVolume: parseToFloat(quoteVolume),
      });
    });
  }
}

module.exports = Uniswap3base;
