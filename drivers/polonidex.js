const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils');

/**
 * @memberof Driver
 * @augments Driver
 */
class PoloniDEX extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const { data: { rows: tickers } } = await request('https://api.trx.market/api/trxmarket/marketPair/pairAllInfoList');

    return tickers.map((ticker) => new Ticker({
      base: ticker.fShortName,
      baseReference: ticker.fTokenAddr,
      baseName: ticker.fTokenName,
      quote: ticker.sShortName,
      quoteReference: ticker.sTokenAddr,
      quoteName: ticker.sTokenName,
      high: parseToFloat(ticker.highestPrice24h),
      low: parseToFloat(ticker.lowestPrice24h),
      close: parseToFloat(ticker.price / 10 ** (ticker.sPrecision)),
      quoteVolume: parseToFloat(ticker.volume24h / 10 ** (ticker.sPrecision)),
    }));
  }
}

module.exports = PoloniDEX;
