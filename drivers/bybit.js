const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat, throttleMap } = require('../lib/utils');

/**
 * @memberof Driver
 * @augments Driver
 */
class Bybit extends Driver {
  /**
   * @param {boolean} isMocked Set to true when stored tickers are used
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers(isMocked) {
    const { result: markets } = await request('https://api.bybit.com/spot/v1/symbols');

    const tickerPromises = throttleMap(markets, async (market) => {
      const { result: ticker } = await request(`https://api.bybit.com/spot/quote/v1/ticker/24hr?symbol=${market.name}`);
      return new Ticker({
        base: market.baseCurrency,
        quote: market.quoteCurrency,
        baseVolume: parseToFloat(ticker.volume),
        quoteVolume: parseToFloat(ticker.quoteVolume),
        open: parseToFloat(ticker.openPrice),
        high: parseToFloat(ticker.highPrice),
        low: parseToFloat(ticker.lowPrice),
        close: parseToFloat(ticker.lastPrice),
        ask: parseToFloat(ticker.bestAskPrice),
        bid: parseToFloat(ticker.bestBidPrice),
      });
    }, isMocked ? 0 : 200); // 5 requests per second

    return Promise.all(tickerPromises);
  }
}

module.exports = Bybit;
