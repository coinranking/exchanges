const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils');

/**
 * @memberof Driver
 * @augments Driver
 */
class Unnamed extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const tickers = await request('https://api.unnamed.exchange/v1/Public/Ticker');

    return tickers.map((ticker) => {
      const [base, quote] = ticker.market.split('_');

      return new Ticker({
        base,
        quote,
        high: parseToFloat(ticker.high),
        low: parseToFloat(ticker.low),
        close: parseToFloat(ticker.close),
        bid: parseToFloat(ticker.highestBuy),
        ask: parseToFloat(ticker.lowestSell),
        // Warning: they've reversed base and quote volume
        baseVolume: parseToFloat(ticker.volume),
        quoteVolume: parseToFloat(ticker.baseVolume),
      });
    });
  }
}

module.exports = Unnamed;
