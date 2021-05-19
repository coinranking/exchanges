const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils');

/**
 * @memberof Driver
 * @augments Driver
 */
class Independentreserve extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const baseCurrencies = await request('https://api.independentreserve.com/Public/GetValidPrimaryCurrencyCodes');
    const quoteCurrencies = await request('https://api.independentreserve.com/Public/GetValidSecondaryCurrencyCodes');

    const pairs = [];
    baseCurrencies.forEach((base) => {
      quoteCurrencies.forEach((quote) => {
        pairs.push({
          base,
          quote,
        });
      });
    });

    const tickers = pairs.map(async (pair) => {
      const { base, quote } = pair;
      const ticker = await request(`https://api.independentreserve.com/Public/GetMarketSummary?primaryCurrencyCode=${base}&secondaryCurrencyCode=${quote}`);

      return new Ticker({
        base,
        quote,
        baseVolume: parseToFloat(ticker.DayVolumeXbtInSecondaryCurrrency),
        close: parseToFloat(ticker.LastPrice),
        high: parseToFloat(ticker.DayHighestPrice),
        low: parseToFloat(ticker.DayLowestPrice),
        vwap: parseToFloat(ticker.DayAvgPrice),
      });
    });

    return Promise.all(tickers);
  }
}

module.exports = Independentreserve;
