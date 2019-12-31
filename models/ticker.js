const { isUndefined, isGreaterThanZero } = require('../lib/utils');

/**
 * Ticker class
 *
 * @class
 */

module.exports = class Ticker {
  /**
   * Create a new ticker
   *
   * @param {object} params - The params
   * @param {string} params.base - Base
   * @param {string} [params.baseName] -
   * The name of the base currency e.g. Ethereum.
   * @param {string} [params.baseReference] -
   * A unique indentifier of the base currency on a particular blockchain.
   * For example: on the Ethereum blockchain this would be the smart contract address,
   * on EOS this would be the token name together with the account name and on Waves this
   * should be the AssetId. e.g. 0x0000000000000000000000000000000000000000.
   * @param {string} params.quote - Quote
   * @param {string} [params.quoteName] -
   * The name of the quote currency e.g. Tether.
   * @param {string} [params.quoteReference] -
   * A unique indentifier of the quote currency on a particular blockchain.
   * For example: on the Ethereum blockchain this would be the smart contract address,
   * on EOS this would be the token name together with the account name and on Waves this
   * should be the AssetId. e.g. 0xdac17f958d2ee523a2206206994597c13d831ec7.
   * @param {number} [params.open] - The price of the market 24 hours ago
   * @param {number} [params.high] - The highest price of the market in the last 24 hours
   * @param {number} [params.low] - The lowest price of the market in the last 24 hours
   * @param {number} params.close - The last price of the market
   * @param {number} [params.bid] -
   * Current minimum ask of the market.
   * The bid is the buyer of the base currency
   * and should always be lower than or equal to the ask.
   * @param {number} [params.ask] -
   * Current maximum bid of the market.
   * The ask is the seller of the base currency
   * and should always be higher than or equal to the bid.
   * @param {number} [params.vwap] - Volume weighted Average Price of the last 24 hours
   * @param {number} [params.baseVolume] -
   * The volume traded in the last 24 hours in the base currency.
   * Which is ETH in the ETH_BTC pair for example.
   * Base volume is only optional if quote volume is provided.
   * @param {number} [params.quoteVolume] -
   * The volume traded in the last 24 hours in the quote currency.
   * Which is BTC in the ETH_BTC pair for example.
   * Quote volume is only optional if base volume is provided.
   *
   * @example
   * const ticker = new Ticker({
   *   base: 'ETH',
   *   quote: 'BTC',
   *   baseName: 'Ethereum',
   *   quoteName: 'Bitcoin',
   *   open: 0.033633,
   *   high: 0.033890,
   *   low: 0.033622,
   *   close: 0.033721,
   *   bid: 0.033701,
   *   ask: 0.033732,
   *   baseVolume: 488239,
   *   quoteVolume: 16463.91,
   * });
   */

  constructor(params) {
    if (params.base) this.base = params.base;
    if (params.baseName) this.baseName = params.baseName;
    if (params.baseReference) this.baseReference = params.baseReference;
    if (params.quote) this.quote = params.quote;
    if (params.quoteName) this.quoteName = params.quoteName;
    if (params.quoteReference) this.quoteReference = params.quoteReference;
    if (params.high) this.high = params.high;
    if (params.low) this.low = params.low;
    if (params.close) this.close = params.close;
    if (params.bid) this.bid = params.bid;
    if (params.ask) this.ask = params.ask;
    if (params.vwap) this.vwap = params.vwap;
    if (params.baseVolume) this.baseVolume = params.baseVolume;
    if (params.quoteVolume) this.quoteVolume = params.quoteVolume;
  }

  /**
   * Combines the base and quote symbols of traded currencies (in that order)
   * divided by an underscore to represent a pair.
   *
   * @type {string}
   *
   * @example
   * const ticker = new Ticker({
   *   base: 'ETH',
   *   quote: 'BTC',
   *   close: 0.3,
   *   baseVolume: 10,
   * });
   *
   * ticker.pair; // ETH_BTC
   */

  get pair() {
    const base = this
      .base
      .replace(/[^A-Za-z0-9*]/g, '')
      .toUpperCase();
    const quote = this
      .quote
      .replace(/[^A-Za-z0-9*]/g, '')
      .toUpperCase();

    return `${base}_${quote}`;
  }

  /**
   * Check the validity of the ticker
   *
   * @function
   * @returns {boolean}
   *
   * @example
   * const ticker = new Ticker({
   *   base: 'ETH',
   *   quote: 'BTC',
   *   close: 0.3,
   *   baseVolume: 10,
   * });
   *
   * ticker.isValid(); // true
   */

  isValid() {
    if (!this.base || !this.quote) {
      if (process.env.NODE_ENV === 'development') {
        console.warn(`${this.pair} is being filtered. Base or quote is not set`);
      }
      return false;
    }

    if (isUndefined(this.baseVolume) && isUndefined(this.quoteVolume)) {
      if (process.env.NODE_ENV === 'development') {
        console.warn(`${this.pair} is being filtered. Both base and quote volume are undefined.`);
      }
      return false;
    }

    if (!isGreaterThanZero(this.close)) {
      if (process.env.NODE_ENV === 'development') {
        console.warn(`${this.pair} is being filtered. Close is not greater than zero.`);
      }
      return false;
    }

    return true;
  }
};
