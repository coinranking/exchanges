const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils');

/**
 * @memberof Driver
 * @augments Driver
 */
class Unisat extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const { data: { list: tickers } } = await request({
      headers: {
        'Content-Type': 'application/json',
      },
      body: {},
      method: 'POST',
      url: 'https://market-api.unisat.io/unisat-market-v2/auction/brc20_types',
    });

    return tickers.map((ticker) => {
      const base = ticker.tick;
      const quote = 'BTC';

      return new Ticker({
        base,
        quote,
        baseVolume: parseToFloat(ticker.amountVolume),
        quoteVolume: parseToFloat(ticker.btcVolume) / 100000000,
        open: parseToFloat(ticker.open),
        high: parseToFloat(ticker.high),
        low: parseToFloat(ticker.low),
        close: parseToFloat(ticker.curPrice) / 100000000,
      });
    });
  }
}

module.exports = Unisat;
