const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils');

/**
 * @memberof Driver
 * @augments Driver
 */
class Korbit extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const tickers = await request('https://api.korbit.co.kr/v1/ticker/detailed/all');
    const markets = Object.keys(tickers);

    return markets.map((market) => {
      const [base, quote] = market.split('_');
      const ticker = tickers[market];

      return new Ticker({
        base,
        quote,
        baseVolume: parseToFloat(ticker.volume),
        close: parseToFloat(ticker.last),
        open: parseToFloat(ticker.open),
        high: parseToFloat(ticker.high),
        low: parseToFloat(ticker.low),
      });
    });
  }
}

module.exports = Korbit;
