const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils');

/**
 * @memberof Driver
 * @augments Driver
 */
class Coinfloor extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const markets = [
      { base: 'XBT', quote: 'GBP' },
      { base: 'XBT', quote: 'EUR' },
      { base: 'BCH', quote: 'GBP' },
      { base: 'ETH', quote: 'GBP' },
    ];

    const tickers = markets.map(async (market) => {
      try {
        const { base, quote } = market;
        const ticker = await request(`https://webapi.coinfloor.co.uk/bist/${base}/${quote}/ticker/`);

        return new Ticker({
          base,
          quote,
          baseVolume: parseToFloat(ticker.volume),
          high: parseToFloat(ticker.high),
          low: parseToFloat(ticker.low),
          close: parseToFloat(ticker.last),
        });
      } catch (e) {
        return undefined;
      }
    });

    return Promise.all(tickers);
  }
}

module.exports = Coinfloor;
