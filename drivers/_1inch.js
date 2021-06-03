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

    return tickers.map((ticker) => {
      if (
        Number(ticker.token0.derivedETH) === 0
        || Number(ticker.token1.derivedETH) === 0
        || Number(ticker.reserveUSD) === 0
        || Number(ticker.reserve0) === 0
        || Number(ticker.reserve1) === 0
      ) return undefined;

      return new Ticker({
        base: ticker.token1.symbol,
        baseReference: ticker.token1.address,
        quote: ticker.token0.symbol,
        quoteReference: ticker.token0.address,
        close: ticker.token1.derivedETH / ticker.token0.derivedETH,
        baseVolume: ticker.volumeUSD24h / (ticker.reserveUSD / 2 / ticker.reserve1),
        quoteVolume: ticker.volumeUSD24h / (ticker.reserveUSD / 2 / ticker.reserve0),
      });
    });
  }
}

module.exports = _1inch;
