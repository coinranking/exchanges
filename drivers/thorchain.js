const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');

/**
 * @memberof Driver
 * @augments Driver
 */
class Thorchain extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const pools = await request('https://midgard.thorswap.net/v2/pools?status=available');

    return pools.map((pool) => {
      const [base, baseReference] = pool.asset.split('-');

      return new Ticker({
        base,
        baseReference,
        quote: 'RUNE',
        close: pool.assetPrice,
        quoteVolume: pool.volume24h / (10 ** 8),
      });
    });
  }
}

module.exports = Thorchain;
