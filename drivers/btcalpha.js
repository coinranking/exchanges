const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils');

/**
 * @memberof Driver
 * @augments Driver
 */
class Btcalpha extends Driver {
  async fetchTickers() {
    const tickers = await request('https://btc-alpha.com/api/v1/ticker/');

    return tickers.map((ticker) => {
      const [base, quote] = ticker.pair.split('_');

      return new Ticker({
        base,
        quote,
        baseVolume: parseToFloat(ticker.vol),
        high: parseToFloat(ticker.high),
        low: parseToFloat(ticker.low),
        close: parseToFloat(ticker.last),
      });
    });
  }
}

module.exports = Btcalpha;
