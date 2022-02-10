const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils');

/**
 * @memberof Driver
 * @augments Driver
 */
class Yobit extends Driver {
  constructor() {
    super({
      supports: {
        specificMarkets: true,
      },
    });
  }

  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    /**
     * Because Yobit currently has over 8000 pairs it is to heavy to fetch them all. This driver
     * therefor requires you to specify which pairs you want to fetch. If you do not specify any
     * pairs it will default to just the BTC-USDT and ETH-BTC pairs
     */
    const pairs = this.markets ? this.markets.join('-') : 'btc_usdt-eth_btc';
    const tickers = await request(`https://yobit.net/api/3/ticker/${pairs}`);

    return Object.keys(tickers).map((pair) => {
      const ticker = tickers[pair];
      const [base, quote] = pair.split('_');

      return new Ticker({
        base,
        quote,
        high: parseToFloat(ticker.high),
        low: parseToFloat(ticker.low),
        close: parseToFloat(ticker.last),
        bid: parseToFloat(ticker.buy),
        ask: parseToFloat(ticker.sell),
        baseVolume: parseToFloat(ticker.vol_cur),
        quoteVolume: parseToFloat(ticker.vol),
      });
    });
  }
}

module.exports = Yobit;
