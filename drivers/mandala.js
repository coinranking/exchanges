const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils');

/**
 * @memberof Driver
 * @augments Driver
 */
class Mandala extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    // Uses endpoint not mentioned in Mandala api docs but in their blog: https://www.mandala.exchange/post/how-to-pull-volume-data-from-the-mandala-exchange-api
    const { data: { list: tickers } } = await request('https://trade.mandala.exchange/v1/market/trading-pairs');
    return tickers.flatMap((ticker) => {
      // Skip pairs that do not have pairs through Mandala
      if (ticker.baseVolume === '0') return [];

      return new Ticker({
        base: ticker.baseAsset,
        baseName: ticker.name,
        quote: ticker.quoteAsset,
        open: parseToFloat(ticker.open),
        high: parseToFloat(ticker.high),
        low: parseToFloat(ticker.low),
        close: parseToFloat(ticker.close),
        // baseVolume is just Mandala volume, volume includes Binance cloud
        baseVolume: parseToFloat(ticker.baseVolume),
        // quoteVolume is just Mandala volume, amount includes Binance cloud
        quoteVolume: parseToFloat(ticker.quoteVolume),
      });
    });
  }
}

module.exports = Mandala;
