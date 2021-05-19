const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils');

/**
 * @memberof Driver
 * @augments Driver
 */
class Tradesatoshi extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const { result: tickers } = await request('https://tradesatoshi.com/api/public/getmarketsummaries');

    return tickers
      .filter((ticker) => ticker.marketStatus === 'OK')
      .map((ticker) => {
        const [base, quote] = ticker.market.split('_');

        // Warning: TradeSatoshi uses baseVolume as quoteVolume
        return new Ticker({
          base,
          quote,
          quoteVolume: parseToFloat(ticker.baseVolume),
          baseVolume: parseToFloat(ticker.volume),
          close: parseToFloat(ticker.last),
          high: parseToFloat(ticker.high),
          low: parseToFloat(ticker.low),
        });
      });
  }
}

module.exports = Tradesatoshi;
