const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils');

/**
 * @memberof Driver
 * @augments Driver
 */
class Tokpie extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const markets = await request('https://tokpie.com/api_ticker/');

    return Object.keys(markets).flatMap((market) => {
      const ticker = markets[market];
      if (ticker.isFrozen) return [];

      const [base, quote] = ticker.pair.split('@');

      const close = parseToFloat(ticker.last);
      const baseVolume = parseToFloat(ticker.baseVolume);
      const quoteVolume = parseToFloat(ticker.quoteVolume);

      if (!close) return [];
      if (!baseVolume && !quoteVolume) return [];

      return new Ticker({
        base,
        quote,
        open: parseToFloat(ticker.at_first24),
        high: parseToFloat(ticker.high24hr),
        low: parseToFloat(ticker.low24hr),
        close,
        bid: parseToFloat(ticker.highestBid),
        ask: parseToFloat(ticker.lowestAsk),
        baseVolume,
        quoteVolume,
      });
    });
  }
}

module.exports = Tokpie;
