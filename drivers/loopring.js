const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils');

/**
 * @memberof Driver
 * @augments Driver
 */
class Loopring extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const { markets } = await request('https://api3.loopring.io/api/v3/exchange/markets');
    const tokens = await request('https://api3.loopring.io/api/v3/exchange/tokens');

    const pairs = markets.map((item) => item.market);

    const { tickers } = await request(`https://api3.loopring.io/api/v3/ticker?market=${pairs.join(',')}`);

    return tickers.flatMap((ticker) => {
      if (ticker[2] === '0') return []; // Skip markets without volume

      const [base, quote] = ticker[0].split('-');

      const { decimals, address, name } = tokens.find((item) => item.symbol === base);
      const {
        decimals: decimalsQuote,
        address: quoteAddress,
        name: quoteName,
      } = tokens.find((item) => item.symbol === quote);

      return new Ticker({
        base,
        baseName: name,
        baseReference: address,
        quote,
        quoteName,
        qouteReference: quoteAddress,
        high: parseToFloat(ticker[5]),
        low: parseToFloat(ticker[6]),
        close: parseToFloat(ticker[7]),
        bid: parseToFloat(ticker[9]),
        ask: parseToFloat(ticker[10]),
        open: parseToFloat(ticker[4]),
        baseVolume: parseToFloat(ticker[2] / 10 ** decimals),
        quoteVolume: parseToFloat(ticker[3] / 10 ** decimalsQuote),
      });
    }); // 20 requests per second
  }
}

module.exports = Loopring;
