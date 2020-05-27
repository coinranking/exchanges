const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat, sleep } = require('../lib/utils.js');

/**
 * @memberof Driver
 * @augments Driver
 */
class Latoken extends Driver {
  /**
   * @param {boolean} isMocked Set to true when stored tickers are used
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers(isMocked) {
    const markets = await request('https://api.latoken.com/api/v1/ExchangeInfo/pairs');
    await sleep(isMocked ? 0 : 2000);
    const tickers = await request('https://api.latoken.com/api/v1/MarketData/tickers');

    return markets.map((market) => {
      const quote = market.quotedCurrency;
      const base = market.baseCurrency;

      const ticker = tickers.find((item) => (item.symbol === market.symbol));

      if (!ticker) return undefined;

      return new Ticker({
        base,
        quote,
        quoteVolume: parseToFloat(ticker.volume),
        open: parseToFloat(ticker.open),
        high: parseToFloat(ticker.high),
        low: parseToFloat(ticker.low),
        close: parseToFloat(ticker.close),
      });
    });
  }
}

module.exports = Latoken;
