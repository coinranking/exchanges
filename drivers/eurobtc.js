const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils');

/**
 * @memberof Driver
 * @augments Driver
 */
class Eurobtc extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const symbols = await request(
      'https://www.euro-btc.exchange:443//api/v2/markets.json',
    );
    const markets = await request(
      'https://www.euro-btc.exchange:443//api/v2/tickers.json',
    );
    const pairs = {};

    symbols.forEach((el) => {
      const [base, quote] = el.name.split('/');

      pairs[el.id] = {
        base,
        baseName: el.base_currency,
        quote,
        quoteName: el.quote_currency,
      };
    });

    return Object.keys(markets).map((market) => {
      const { ticker } = markets[market];
      const {
        base, baseName, quote, quoteName,
      } = pairs[market];

      return new Ticker({
        base,
        baseName,
        quote,
        quoteName,
        high: parseToFloat(ticker.high),
        low: parseToFloat(ticker.low),
        close: parseToFloat(ticker.last),
        bid: parseToFloat(ticker.buy),
        ask: parseToFloat(ticker.sell),
        baseVolume: parseToFloat(ticker.vol),
      });
    });
  }
}

module.exports = Eurobtc;
