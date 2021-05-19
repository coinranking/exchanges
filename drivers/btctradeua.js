const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils');

/**
 * @memberof Driver
 * @augments Driver
 */
class Btctradeua extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const tickers = await request('https://btc-trade.com.ua/api/ticker');
    const markets = Object.keys(tickers);

    return markets.map((market) => {
      const [base, quote] = market.split('_');

      const ticker = tickers[market];

      return new Ticker({
        base,
        quote,
        high: parseToFloat(ticker.high),
        low: parseToFloat(ticker.low),
        close: parseToFloat(ticker.last),
        vwap: parseToFloat(ticker.avg),
        baseVolume: parseToFloat(ticker.vol),
        quoteVolume: parseToFloat(ticker.vol_cur),
      });
    });
  }
}

module.exports = Btctradeua;
