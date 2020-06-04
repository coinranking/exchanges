const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

/**
 * @memberof Driver
 * @augments Driver
 */
class Bitcratic extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const tickers = await request('https://bitcratic.org/returnTicker');
    const markets = Object.keys(tickers);
    const { tokens } = await request('https://www.bitcratic.com/config/main.json');

    return markets.map((market) => {
    // Warning: bitcratic inverts base and quote!
      const [quote] = market.split('_');
      const ticker = tickers[market];
      const baseToken = tokens.find((item) => item.addr === ticker.tokenAddr);

      if (!baseToken) return undefined;

      return new Ticker({
        base: baseToken.name,
        baseName: baseToken.fullName,
        baseReference: ticker.tokenAddr,
        quote,
        quoteVolume: parseToFloat(ticker.baseVolume),
        baseVolume: parseToFloat(ticker.quoteVolume),
        close: parseToFloat(ticker.last),
      });
    });
  }
}

module.exports = Bitcratic;
