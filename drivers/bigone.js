const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils');

/**
 * @memberof Driver
 * @augments Driver
 */
class Bigone extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const result = await request('https://big.one/api/v3/asset_pairs/tickers');
    const tickers = result.data;

    return tickers.map((ticker) => {
      const [base, quote] = ticker.asset_pair_name.split('-');

      return new Ticker({
        base,
        quote,
        baseVolume: parseToFloat(ticker.volume),
        open: parseToFloat(ticker.open),
        high: parseToFloat(ticker.high),
        low: parseToFloat(ticker.low),
        close: parseToFloat(ticker.close),
        bid: ticker.bid ? parseToFloat(ticker.bid.price) : undefined,
        ask: ticker.ask ? parseToFloat(ticker.ask.price) : undefined,
      });
    });
  }
}

module.exports = Bigone;
