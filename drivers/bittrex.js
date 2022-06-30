const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils');

/**
 * @memberof Driver
 * @augments Driver
 */
class Bittrex extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const summaries = await request('https://api.bittrex.com/v3/markets/summaries');
    const closes = await request('https://api.bittrex.com/v3/markets/tickers');

    return summaries.flatMap((summary) => {
      const [base, quote] = summary.symbol.split('-');
      const { lastTradeRate: close } = closes.find((item) => summary.symbol === item.symbol);

      if (!parseToFloat(summary.volume)) return [];
      if (!parseToFloat(close)) return [];

      return new Ticker({
        base,
        quote,
        baseVolume: parseToFloat(summary.volume),
        quoteVolume: parseToFloat(summary.quoteVolume),
        high: parseToFloat(summary.high),
        low: parseToFloat(summary.low),
        close: parseToFloat(close),
      });
    });
  }
}

module.exports = Bittrex;
