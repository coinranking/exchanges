const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils');

/**
 * @memberof Driver
 * @augments Driver
 */
class Aax extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const { data: markets } = await request('https://api.aax.com/v2/instruments');
    const { data: currencies } = await request('https://api.aax.com/v2/currencies');
    const { tickers } = await request('https://api.aax.com/v2/market/tickers');

    return markets.flatMap((market) => {
      // Aax also has futures, which we do not support
      if (market.type !== 'spot') return [];

      const ticker = tickers.find((item) => item.s === market.symbol);

      // Not all markets have tickers
      if (!ticker) return [];

      const base = currencies.find((item) => item.currency === market.base);
      const quote = currencies.find((item) => item.currency === market.quote);

      return new Ticker({
        base: market.base,
        baseName: base ? base.displayName : undefined,
        quote: market.quote,
        quoteName: quote ? quote.displayName : undefined,
        open: parseToFloat(ticker.o),
        high: parseToFloat(ticker.h),
        low: parseToFloat(ticker.l),
        close: parseToFloat(ticker.c),
        quoteVolume: parseToFloat(ticker.v),
      });
    });
  }
}

module.exports = Aax;
