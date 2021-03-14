const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat, throttleFlatMap } = require('../lib/utils.js');

/**
 * @memberof Driver
 * @augments Driver
 */
class Yobit extends Driver {
  /**
   * @param isMocked
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers(isMocked) {
    const { pairs } = await request('https://yobit.net/api/3/info');
    const markets = [];
    const keys = Object.keys(pairs);

    const max = 50;
    // eslint-disable-next-line no-constant-condition
    while (true) {
      if (keys.length === 0) {
        break;
      }
      const data = keys.splice(0, max);

      markets.push(data.join('-'));
    }

    return throttleFlatMap(markets, async (market) => {
      const tickersData = await request(`https://yobit.net/api/3/ticker/${market}`);

      return Object.keys(tickersData).map((tickerName) => {
        const [base, quote] = tickerName.split('_');
        const ticker = tickersData[tickerName];

        return new Ticker({
          base,
          quote,
          high: parseToFloat(ticker.high),
          low: parseToFloat(ticker.low),
          close: parseToFloat(ticker.last),
          bid: parseToFloat(ticker.buy),
          ask: parseToFloat(ticker.sell),
          baseVolume: parseToFloat(ticker.vol_cur),
          quoteVolume: parseToFloat(ticker.vol),
        });
      });
    }, isMocked ? 0 : 100); // 10 requests per second
  }
}

module.exports = Yobit;
