const tls = require('tls');
const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { arrayToChunks, flatMap, parseToFloat } = require('../lib/utils');

// Solves HTTPS errors
process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;
// Solves EPROTO errors in some SSL requests
tls.DEFAULT_ECDH_CURVE = 'auto';

/**
 * @memberof Driver
 * @augments Driver
 */
class Dsx extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const { pairs } = await request('https://dsx.uk/mapi/info');
    const markets = Object.keys(pairs);
    const marketChucks = arrayToChunks(markets, 20);

    return flatMap(marketChucks, async (marketChuck) => {
      const tickers = await request(`https://dsx.uk/mapi/ticker/${marketChuck.join('-')}`);

      return marketChuck.map((pair) => {
        const market = pairs[pair];
        const ticker = tickers[pair];

        if (!market) return undefined;
        if (!ticker) return undefined;

        const base = market.base_currency;
        const quote = market.quoted_currency;

        return new Ticker({
          base,
          quote,
          quoteVolume: parseToFloat(ticker.vol),
          baseVolume: parseToFloat(ticker.vol_cur),
          close: parseToFloat(ticker.last),
          high: parseToFloat(ticker.high),
          low: parseToFloat(ticker.low),
          vwap: parseToFloat(ticker.avg),
        });
      });
    });
  }
}

module.exports = Dsx;
