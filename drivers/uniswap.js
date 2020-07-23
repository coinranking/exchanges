const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

/**
 * @memberof Driver
 * @augments Driver
 */
class Uniswap extends Driver {
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
    const { results: tickers } = await request(`https://api.blocklytics.org/pools/v0/exchanges?platform=uniswap&key=${this.key}`);

    return tickers.map((ticker) => new Ticker({
      // Warning: quote and base are inverted
      base: ticker.tokenSymbol,
      baseName: ticker.tokenName,
      baseReference: ticker.token,
      quote: ticker.baseSymbol,
      quoteName: ticker.baseName,
      quoteReference: ticker.base,
      close: parseToFloat(1 / ticker.basePrice),
      baseVolume: parseToFloat(ticker.tokenVolume),
      quoteVolume: parseToFloat(ticker.baseVolume),
    }));
  }
}

module.exports = Uniswap;
