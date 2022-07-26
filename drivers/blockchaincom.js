const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils');

/**
 * @memberof Driver
 * @augments Driver
 */
class Blockchaincom extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const tickers = await request(' https://api.blockchain.com/v3/exchange/tickers');

    return tickers.map((ticker) => {
      const [base, quote] = ticker.symbol.split('-');

      return new Ticker({
        base,
        quote,
        close: parseToFloat(ticker.last_trade_price),
        baseVolume: parseToFloat(ticker.volume_24h),
      });
    });
  }
}

module.exports = Blockchaincom;
