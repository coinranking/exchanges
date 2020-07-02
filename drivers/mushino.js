const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

/**
 * @memberof Driver
 * @augments Driver
 */
class Mushino extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const markets = await request('https://api.mushino.com/ticker');

    return Object.keys(markets).map((market) => {
      const [base, quote] = market.split('_');
      if ([base, quote].includes('SHIT') || [base, quote].includes('ALTS')) {
        return undefined;
      }

      const ticker = markets[market];

      return new Ticker({
        base,
        quote,
        high: parseToFloat(ticker.high_price),
        low: parseToFloat(ticker.low_price),
        close: parseToFloat(ticker.last_price),
        open: parseToFloat(ticker.open_price),
        ask: parseToFloat(ticker.ask_price),
        bid: parseToFloat(ticker.bid_price),
        baseVolume: parseToFloat(ticker.base_volume),
        quoteVolume: parseToFloat(ticker.quote_volume),
      });
    });
  }
}

module.exports = Mushino;
