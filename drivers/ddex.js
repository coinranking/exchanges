const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils');

/**
 * @memberof Driver
 * @augments Driver
 */
class Ddex extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const { data: marketData } = await request('https://api.ddex.io/v3/markets');
    const { data: tickerData } = await request('https://api.ddex.io/v3/markets/tickers');
    const { markets } = marketData;
    const { tickers } = tickerData;

    return tickers.map((ticker) => {
      const [base, quote] = ticker.marketId.split('-');
      const market = markets.find((item) => (item.id === ticker.marketId));

      let baseName;
      let baseReference;
      let quoteReference;
      if (market) {
        baseName = market.baseTokenName;
        baseReference = market.baseTokenAddress;
        quoteReference = market.quoteTokenAddress;
      }

      return new Ticker({
        base,
        quote,
        baseName,
        baseReference,
        quoteReference,
        baseVolume: parseToFloat(ticker.volume),
        close: parseToFloat(ticker.price),
        high: parseToFloat(ticker.high),
        low: parseToFloat(ticker.low),
      });
    });
  }
}

module.exports = Ddex;
