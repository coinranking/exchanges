const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');

/**
 * @memberof Driver
 * @augments Driver
 */
class _1inch extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const tickers = await request('https://governance.1inch.exchange/v1.1/protocol/pairs');

    return tickers.map((ticker) => new Ticker({
      base: ticker.token0.symbol,
      baseReference: ticker.token0.address,
      quote: ticker.token1.symbol,
      quoteReference: ticker.token1.address,
      close: ticker.token0.derivedETH / ticker.token1.derivedETH,
      baseVolume: ticker.volumeUSD24h / (ticker.reserveUSD / 2 / ticker.reserve0),
      quoteVolume: ticker.volumeUSD24h / (ticker.reserveUSD / 2 / ticker.reserve1),
    }));
  }
}

module.exports = _1inch;
