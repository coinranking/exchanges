const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

/**
 * @memberof Driver
 * @augments Driver
 */
class Ajubit extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const pairs = await request('https://ajubit.com/api/v2/markets');
    const tickers = await request('https://ajubit.com/api/v2/tickers');

    return pairs.map((pair) => {
      const [base, quote] = pair.name.split('/');

      const { ticker } = tickers[pair.id];

      if (!ticker) {
        return undefined;
      }

      return new Ticker({
        base,
        quote,
        high: parseToFloat(ticker.high),
        low: parseToFloat(ticker.low),
        close: parseToFloat(ticker.last),
        open: parseToFloat(ticker.open),
        baseVolume: parseToFloat(ticker.vol),
      });
    });
  }
}

module.exports = Ajubit;
