const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

/**
 * @memberof Driver
 * @augments Driver
 */
class Binance extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const { symbols: markets } = await request('https://api.binance.com/api/v3/exchangeInfo');
    const tickers = await request('https://api.binance.com/api/v3/ticker/24hr');

    return markets
      .filter((market) => market.status === 'TRADING' && market.isSpotTradingAllowed === true)
      .map((market) => {
        const base = market.baseAsset;
        const quote = market.quoteAsset;
        const ticker = tickers.find((item) => item.symbol === market.symbol);
        if (!ticker) return undefined;

        return new Ticker({
          base,
          quote,
          quoteVolume: parseToFloat(ticker.quoteVolume),
          baseVolume: parseToFloat(ticker.volume),
          close: parseToFloat(ticker.lastPrice),
          open: parseToFloat(ticker.openPrice),
          high: parseToFloat(ticker.highPrice),
          low: parseToFloat(ticker.lowPrice),
          ask: parseToFloat(ticker.askPrice),
          bid: parseToFloat(ticker.bidPrice),
          vwap: parseToFloat(ticker.weightedAvgPrice),
        });
      });
  }
}

module.exports = Binance;
