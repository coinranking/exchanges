const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

/**
 * @memberof Driver
 * @augments Driver
 */
class Polarity extends Driver {
  /**
   * @augments Driver.fetchTickers
   * @returns {Promise.Array<Ticker>} Returns a promise of an array with tickers.
   */
  async fetchTickers() {
    const { data: tickers } = await request(
      'https://data-service.polarity.exchange/pairs',
    );
    const { data: symbols } = await request('https://data-service.polarity.exchange/assets?ticker=%2A&limit=100');
    const markets = {
      '7RB3BWayeCVPq3kkpkeJZAFv2DYCB5gEwnutEpRofaw4': {
        symbol: 'USDT',
        name: 'Tether',
      },
    };

    symbols.forEach((el) => {
      const { data } = el;

      markets[data.id] = {
        symbol: data.ticker,
        name: data.name,
      };
    });

    return tickers.map((ticker) => {
      if (!markets[ticker.amountAsset] || !markets[ticker.priceAsset]) {
        return undefined;
      }

      const { symbol: base, name: baseName } = markets[ticker.amountAsset];
      const { symbol: quote, name: quoteName } = markets[ticker.priceAsset];

      const { data } = ticker;

      return new Ticker({
        base,
        baseName,
        quote,
        quoteName,
        high: parseToFloat(data.high),
        low: parseToFloat(data.low),
        close: parseToFloat(data.lastPrice),
        baseVolume: parseToFloat(data.volume),
        quoteVolume: parseToFloat(data.quoteVolume),
      });
    });
  }
}

module.exports = Polarity;
