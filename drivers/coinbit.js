const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

/**
 * @memberof Driver
 * @augments Driver
 */
class Coinbit extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const tickers = await request('https://coinmarketcapapi.coinbit.co.kr/marketPrice');
    const markets = Object.keys(tickers);

    return markets.map((market) => {
    // Quote and base are inverted
      const [quote, base] = market.split('_');
      const ticker = tickers[market];

      return new Ticker({
        base,
        quote,
        // Yes the quoto typo is on purpose haha
        quoteVolume: parseToFloat(ticker.quotoVolume),
        baseVolume: parseToFloat(ticker.baseVolume),
        close: parseToFloat(ticker.last),
        high: parseToFloat(ticker.high24hr),
        low: parseToFloat(ticker.low24hr),
      });
    });
  }
}

module.exports = Coinbit;
