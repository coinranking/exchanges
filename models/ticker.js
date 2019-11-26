const { isUndefined, isGreaterThanZero } = require('../lib/utils');

module.exports = class Ticker {
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
