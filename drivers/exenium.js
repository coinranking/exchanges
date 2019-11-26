const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

module.exports = async () => {
  const { items: tickers } = await request('https://api.exenium.io/trade/pair/listfull');

  return tickers.map((ticker) => {
    const [base, quote] = ticker.currency_codes;

    return new Ticker({
      base,
      quote,
      quoteVolume: parseToFloat(ticker.volume24h),
      close: parseToFloat(ticker.price),
      high: parseToFloat(ticker.high24h),
      low: parseToFloat(ticker.low24h),
    });
  });
};
