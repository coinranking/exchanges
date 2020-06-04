const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

/**
 * @memberof Driver
 * @augments Driver
 */
class Bitfinex extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const tickers = await request('https://api.bitfinex.com/v1/tickers');
    const [names, symbols] = await request('https://api-pub.bitfinex.com/v2/conf/pub:map:currency:label,pub:map:currency:sym');
    const [currencies] = await request('https://api-pub.bitfinex.com/v2/conf/pub:list:currency');

    const namesMap = new Map(names);
    const symbolsMap = new Map(symbols);

    return tickers.map((ticker) => {
      const regex = new RegExp(`^([A-Z]*)(${currencies.join('|')})$`);
      const pair = regex.exec(ticker.pair);
      if (!pair) return undefined;
      const [, base, quote] = pair;

      return new Ticker({
        base: symbolsMap.get(base) || base,
        quote: symbolsMap.get(quote) || quote,
        baseName: namesMap.get(base),
        quoteName: namesMap.get(quote),
        baseVolume: parseToFloat(ticker.volume),
        close: parseToFloat(ticker.last_price),
        high: parseToFloat(ticker.high),
        low: parseToFloat(ticker.low),
      });
    });
  }
}

module.exports = Bitfinex;
