const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { arrayToChunks, throttleFlatMap, parseToFloat } = require('../lib/utils');

/**
 * @memberof Driver
 * @augments Driver
 */
class Upbit extends Driver {
  /**
   * @param {boolean} isMocked Set to true when stored tickers are used
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers(isMocked) {
    const markets = await request('https://api.upbit.com/v1/market/all');
    const marketChucks = arrayToChunks(markets, 20);

    return throttleFlatMap(marketChucks, async (marketChuck) => {
      const allMarkets = marketChuck.map((item) => item.market).join(',');
      const tickers = await request(`https://api.upbit.com/v1/ticker?markets=${allMarkets}`);

      return tickers.map((ticker) => {
      // Warning: Upbit reverses base and quote
        const [quote, base] = ticker.market.split('-');

        const market = markets.find((item) => (item.market === ticker.market));

        return new Ticker({
          base,
          baseName: market.english_name,
          quote,
          quoteVolume: parseToFloat(ticker.acc_trade_price_24h),
          baseVolume: parseToFloat(ticker.acc_trade_volume_24h),
          open: parseToFloat(ticker.opening_price),
          high: parseToFloat(ticker.high_price),
          low: parseToFloat(ticker.low_price),
          close: parseToFloat(ticker.trade_price),
        });
      });
    }, isMocked ? 0 : 200); // 5 a second
  }
}

module.exports = Upbit;
