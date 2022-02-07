const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils');

/**
 * @memberof Driver
 * @augments Driver
 */
class Bancor extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const { data } = await request('https://api-v2.bancor.network/pools');

    const tickers = data.map((ticker) => {
      const base = ticker.reserves[0];
      const quote = ticker.reserves[1];

      return new Ticker({
        base: base.symbol,
        baseName: base.name,
        baseReference: base.dlt_id,
        quote: quote.symbol,
        quoteName: quote.name,
        quoteReference: quote.dlt_id,
        open: parseToFloat(base.price_24h_ago.usd) / parseToFloat(quote.price_24h_ago.usd),
        close: parseToFloat(base.price.usd) / parseToFloat(quote.price.usd),
        baseVolume: parseToFloat(base.volume_24h.base),
        quoteVolume: parseToFloat(quote.volume_24h.base),
      });
    });

    return tickers;
  }
}

module.exports = Bancor;
