const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils');

/**
 * @memberof Driver
 * @augments Driver
 */
class BuyUcoin extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const { data: tickers } = await request('https://api.buyucoin.com/ticker/v1.0/liveData');

    return tickers.map((ticker) => {
      const [quote, base] = ticker.marketName.split('-'); // reversed

      return new Ticker({
        base,
        quote,
        high: parseToFloat(ticker.h24),
        low: parseToFloat(ticker.l24),
        close: parseToFloat(ticker.LTRate),
        bid: parseToFloat(ticker.bid),
        ask: parseToFloat(ticker.ask),
        quoteVolume: parseToFloat(ticker.tp24),
        baseVolume: parseToFloat(ticker.v24),
      });
    });
  }
}

module.exports = BuyUcoin;
