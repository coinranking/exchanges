const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils');

/**
 * @memberof Driver
 * @augments Driver
 */
class Bitget extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const { data: markets } = await request('https://api.bitget.com/api/spot/v1/public/products');
    const { data: tickers } = await request('https://api.bitget.com/api/spot/v1/market/tickers');

    return markets.flatMap((market) => {
      const ticker = tickers.find((tickerItem) => tickerItem.symbol === market.symbolName);

      // Not all markets might have tickers
      if (!ticker) return [];

      return new Ticker({
        base: market.baseCoin,
        quote: market.quoteCoin,
        high: parseToFloat(ticker.high24h),
        low: parseToFloat(ticker.low24h),
        close: parseToFloat(ticker.close),
        baseVolume: parseToFloat(ticker.baseVol),
        quoteVolume: parseToFloat(ticker.quoteVol),
      });
    });
  }
}

module.exports = Bitget;
