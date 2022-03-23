const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils');

/**
 * @memberof Driver
 * @augments Driver
 */
class Zonda extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const { items: tickersWithVolume } = await request('https://api.zonda.exchange/rest/trading/stats');
    const { items: tickersWithRate } = await request('https://api.zonda.exchange/rest/trading/ticker');

    return Object.keys(tickersWithRate).map((pair) => {
      const tickerWithRate = tickersWithRate[pair];
      const tickerWithVolume = tickersWithVolume[pair];
      const [base, quote] = pair.split('-');

      return new Ticker({
        base,
        quote,
        open: parseToFloat(tickerWithVolume.r24h),
        high: parseToFloat(tickerWithVolume.h),
        low: parseToFloat(tickerWithVolume.l),
        close: parseToFloat(tickerWithRate.rate),
        bid: parseToFloat(tickerWithRate.highestBid),
        ask: parseToFloat(tickerWithRate.lowestAsk),
        baseVolume: parseToFloat(tickerWithVolume.v),
      });
    });
  }
}

module.exports = Zonda;
