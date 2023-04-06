const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils');

/**
 * @memberof Driver
 * @augments Driver
 */
class Cex extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const assets = await request('https://plus.cex.io/ranking-api/cmc/api/v1/assets');
    const tickers = await request('https://plus.cex.io/ranking-api/cmc/api/v1/ticker');

    return Object.keys(tickers).map((pair) => {
      const [base, quote] = pair.split('_');
      const ticker = tickers[pair];
      const baseAsset = assets[base];
      const quoteAsset = assets[quote];

      return new Ticker({
        base,
        baseName: baseAsset.name,
        quote,
        quoteName: quoteAsset.name,
        baseVolume: parseToFloat(ticker.base_volume),
        quoteVolume: parseToFloat(ticker.quote_volume),
        close: parseToFloat(ticker.last_price),
      });
    });
  }
}

module.exports = Cex;
