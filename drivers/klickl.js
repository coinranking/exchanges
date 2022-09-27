const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils');

/**
 * @memberof Driver
 * @augments Driver
 */
class Klickl extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const { Data } = await request('https://api.klickl.com/api/idcm/market/Market/GetTradeVarieties');
    return Data.map((ticker) => new Ticker({
      base: ticker.SellerCoinCode,
      quote: ticker.BuyerCoinCode,
      baseVolume: parseToFloat(ticker.Last24TradeQuantity),
      quoteVolume: parseToFloat(ticker.Last24TradeAmount),
      open: parseToFloat(ticker.Open),
      high: parseToFloat(ticker.High),
      low: parseToFloat(ticker.Low),
      close: parseToFloat(ticker.Close),
    }));
  }
}

module.exports = Klickl;
