const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils');

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
    const tickers = await request('https://api-pub.bitfinex.com/v2/tickers?symbols=ALL');
    const [names, symbols] = await request('https://api-pub.bitfinex.com/v2/conf/pub:map:currency:label,pub:map:currency:sym');
    const [currencies] = await request('https://api-pub.bitfinex.com/v2/conf/pub:list:currency');

    const namesMap = new Map(names);
    const symbolsMap = new Map(symbols);

    return tickers.map((ticker) => {
      const regex = new RegExp(`^t(${currencies.join('|')}):?(${currencies.join('|')})$`);
      const pair = regex.exec(ticker[0]);
      if (!pair) return undefined;
      const [, base, quote] = pair;

      const bid = parseToFloat(ticker[1]);
      const ask = parseToFloat(ticker[3]);
      const close = parseToFloat(ticker[7]);
      const baseVolume = parseToFloat(ticker[8]);
      const high = parseToFloat(ticker[9]);
      const low = parseToFloat(ticker[10]);

      return new Ticker({
        base: symbolsMap.get(base) || base,
        quote: symbolsMap.get(quote) || quote,
        baseName: namesMap.get(base),
        quoteName: namesMap.get(quote),
        bid,
        ask,
        baseVolume,
        close,
        high,
        low,
      });
    });
  }
}

module.exports = Bitfinex;
