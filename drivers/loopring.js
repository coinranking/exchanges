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
    const { data: pairs } = await request('https://api.loopring.io/api/v2/exchange/markets');
    const { data: details } = await request('https://api.loopring.io/api/v2/exchange/tokens');

    const markets = pairs.map((item) => item.market);

    const { data: tickers } = await request(`https://api.loopring.io/api/v2/ticker?market=${markets.join(',')}`);

    return tickers.map((ticker) => {
      const [base, quote] = ticker[0].split('-');

      const { decimals, address, name } = details.find((item) => item.symbol === base);
      const {
        decimals: decimalsQuote,
        address: quoteAddress,
        name: quoteName,
      } = details.find((item) => item.symbol === quote);

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
