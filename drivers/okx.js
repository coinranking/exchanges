const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils');

/**
 * @memberof Driver
 * @augments Driver
 */
class Okx extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    // const tickers = await request('https://www.okex.com/api/spot/v3/instruments/ticker');
    const { data: tickers } = await request('https://www.okx.com/api/v5/market/tickers?instType=SPOT');

    return tickers.map((ticker) => {
      const [base, quote] = ticker.instId.split('-');

      return new Ticker({
        base,
        quote,
        baseVolume: parseToFloat(ticker.vol24h),
        quoteVolume: parseToFloat(ticker.volCcy24h),
        open: parseToFloat(ticker.open24h),
        high: parseToFloat(ticker.high24h),
        low: parseToFloat(ticker.low24h),
        close: parseToFloat(ticker.last),
        bid: parseToFloat(ticker.bidPx),
        ask: parseToFloat(ticker.askPx),
      });
    });
  }
}

module.exports = Okx;
