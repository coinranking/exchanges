const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

/**
 * @memberof Driver
 * @augments Driver
 */
class Altcointrader extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const markets = await request('https://api.altcointrader.co.za/v3/live-stats');

    return Object.keys(markets).map((market) => {
      const ticker = markets[market];
      const [base, quote] = market.split('_');

      return new Ticker({
        base,
        quote: quote || 'ZAR',
        high: parseToFloat(ticker.High),
        low: parseToFloat(ticker.Low),
        close: parseToFloat(ticker.Close),
        bid: parseToFloat(ticker.Buy), // reversed with Sell
        ask: parseToFloat(ticker.Sell),
        baseVolume: parseToFloat(ticker.Volume),
      });
    });
  }
}

module.exports = Altcointrader;
