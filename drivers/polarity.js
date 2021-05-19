const Driver = require('../models/driver');
const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils');

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
    const { data: markets } = await request('https://data-service.polarity.exchange/pairs?limit=1000');
    const { data: assets } = await request('https://data-service.polarity.exchange/assets?ticker=*');

    const currencies = assets.map((asset) => ({
      symbol: asset.data.ticker.trim(),
      name: asset.data.name,
      address: asset.data.id,
    }));

    // Add Tether manually because polarity.exchange
    // didn't include the quote currency in the assets list
    currencies.push({
      address: '7RB3BWayeCVPq3kkpkeJZAFv2DYCB5gEwnutEpRofaw4',
      symbol: 'USDT',
      name: 'Tether',
    });

    return markets.map((market) => {
      const baseCurrency = currencies.find((currency) => (market.amountAsset === currency.address));
      const quoteCurrency = currencies.find((currency) => (market.priceAsset === currency.address));

      let base;
      let baseName;
      let baseReference;
      if (baseCurrency) {
        base = baseCurrency.symbol;
        baseName = baseCurrency.name;
        baseReference = baseCurrency.address;
      } else {
        base = market.amountAsset;
        baseReference = market.amountAsset;
      }

      let quote;
      let quoteName;
      let quoteReference;
      if (quoteCurrency) {
        quote = quoteCurrency.symbol;
        quoteName = quoteCurrency.name;
        quoteReference = quoteCurrency.address;
      } else {
        quote = market.priceAsset;
        quoteReference = market.priceAsset;
      }

      const ticker = market.data;

      return new Ticker({
        base,
        baseName,
        baseReference,
        quote,
        quoteName,
        quoteReference,
        open: parseToFloat(ticker.firstPrice),
        high: parseToFloat(ticker.high),
        low: parseToFloat(ticker.low),
        close: parseToFloat(ticker.lastPrice),
        vwap: parseToFloat(ticker.weightedAveragePrice),
        baseVolume: parseToFloat(ticker.volume),
        quoteVolume: parseToFloat(ticker.quoteVolume),
      });
    });
  }
}

module.exports = Polarity;
