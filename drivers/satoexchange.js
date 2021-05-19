const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils');

/**
 * @memberof Driver
 * @augments Driver
 */
class Satoexchange extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const response = await request('https://www.satoexchange.com/api/v3/summary');
    const tickers = response.data;
    const pairs = Object.keys(tickers);

    return pairs.map((pair) => {
      const ticker = tickers[pair];
      // Trailing space after isFrozen is on purpose, that's how it is named in the received data.
      if (ticker['isFrozen ']) return undefined;

      const [base, quote] = pair.split('_');

      return new Ticker({
        base,
        quote,
        quoteVolume: parseToFloat(ticker.quoteVolume),
        baseVolume: parseToFloat(ticker.baseVolume),
        close: parseToFloat(ticker.last),
        high: parseToFloat(ticker.high24hr),
        low: parseToFloat(ticker.low24hr),
      // Bid and ask are left out because they appear to be unreliable; in some cases the highestBid
      // exceeds the lowestAsk, which should not be possible as a trade would be made directly.
      });
    });
  }
}

module.exports = Satoexchange;
