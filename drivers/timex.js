const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat, flatMap } = require('../lib/utils');

/**
 * @memberof Driver
 * @augments Driver
 */
class Timex extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const tickers = await request(
      'https://plasma-relay-backend.timex.io/public/tickers24?useCache=true',
    );
    const markets = await request(
      'https://plasma-relay-backend.timex.io/public/markets',
    );

    const pairs = {};

    markets.forEach((el) => {
      const [base, quote] = el.name.split('/');
      pairs[el.symbol] = {
        base,
        baseReference: el.baseTokenAddress,
        quote,
        quoteReference: el.quoteTokenAddress,
      };
    });

    return flatMap(tickers, (ticker) => {
      const {
        base, baseReference, quote, quoteReference,
      } = pairs[ticker.market];

      return new Ticker({
        base,
        baseReference,
        quote,
        quoteReference,
        high: parseToFloat(ticker.high),
        low: parseToFloat(ticker.low),
        close: parseToFloat(ticker.last),
        bid: parseToFloat(ticker.bid),
        ask: parseToFloat(ticker.ask),
        baseVolume: parseToFloat(ticker.volume),
        quoteVolume: parseToFloat(ticker.volumeQuote),
      });
    });
  }
}

module.exports = Timex;
