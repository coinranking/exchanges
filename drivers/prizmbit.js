const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils');

/**
 * @memberof Driver
 * @augments Driver
 */
class Prizmbit extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const tickers = await request('https://api.prizmbit.com/api/po/MarketData/GetMarketPrices');

    return tickers.map((ticker) => {
      const [base, quote] = ticker.marketName.split('/');

      return new Ticker({
        base,
        quote,
        high: parseToFloat(ticker.highPrice),
        low: parseToFloat(ticker.lowPrice),
        close: parseToFloat(ticker.price),
        bid: parseToFloat(ticker.bid),
        ask: parseToFloat(ticker.ask),
        baseVolume: parseToFloat(ticker.volume),
      });
    });
  }
}

module.exports = Prizmbit;
