const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat, throttleMap } = require('../lib/utils.js');

/**
 * @memberof Driver
 * @augments Driver
 */
class Bamboo extends Driver {
  /**
   * @param {boolean} isMocked Set to true when stored tickers are used
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers(isMocked) {
    const markets = await request('https://rest.bamboorelay.com/main/0x/markets');

    const tickers = throttleMap(markets, async (market) => {
      const [base, quote] = market.id.split('-');

      const { ticker } = await request(`https://rest.bamboorelay.com/main/0x/markets/${market.id}/ticker`);
      const { stats } = await request(`https://rest.bamboorelay.com/main/0x/markets/${market.id}/stats`);

      return new Ticker({
        base,
        baseReference: market.baseTokenAddress,
        quote,
        quoteReference: market.quoteTokenAddress,
        close: parseToFloat(ticker.price),
        baseVolume: parseToFloat(stats.quoteVolume24Hour), // reversed with quote volume
        quoteVolume: parseToFloat(stats.volume24Hour),

      });
    }, isMocked ? 0 : 50);

    return Promise.all(tickers);
  }
}

module.exports = Bamboo;
