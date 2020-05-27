const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat, throttleMap } = require('../lib/utils.js');

/**
 * @memberof Driver
 * @augments Driver
 */
class Bancor extends Driver {
  /**
   * @param {boolean} isMocked Set to true when stored tickers are used
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers(isMocked) {
    const { data } = await request('https://api.bancor.network/0.1/currencies/convertiblePairs');
    const baseCurrencies = Object.keys(data);
    const markets = baseCurrencies
    // Bancor has both GNOBNT/BNT markets as GNO/BNT markets, which provide the same ticker data. We
    // only need one of those, and therefor filter out the XXXBNT/BNT markets
      .filter((base) => (base.indexOf('BNT') === -1))
      .map((market) => {
        const base = market;
        const quote = 'BNT';
        return { base, quote };
      });

    const tickers = throttleMap(markets, async (market) => {
      try {
        const result = await request(`https://api.bancor.network/0.1/currencies/${market.base}/ticker?fromCurrencyCode=${market.quote}`);
        const ticker = result.data;

        /*
       * The api (which currently is in alpha stage) provides decimals, but
       * currently seems to always enforce 18. So hardcoding 18 for now. Enable
       * the decimals above again when api is updated.
       */

        const decimals = 18;
        const close = parseToFloat(ticker.price);
        const quoteVolume = parseToFloat(ticker.volume24h, (number) => number / (10 ** decimals));

        return new Ticker({
          base: market.base,
          quote: market.quote,
          close,
          quoteVolume,
          baseVolume: parseToFloat(quoteVolume / close),
          vwap: parseToFloat(ticker.price24h),
        });
      } catch (error) {
        return undefined;
      }
    }, isMocked ? 0 : 20); // Do batches of 50 a second

    return Promise.all(tickers);
  }
}

module.exports = Bancor;
