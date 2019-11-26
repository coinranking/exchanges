const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

module.exports = async () => {
  const { data: tickers } = await request('https://api.wtzex.io/v1/public/spot/ticker');
  const markets = Object.keys(tickers);

  return markets.map((market) => {
    const [base, quote] = market.split('/');
    const ticker = tickers[market];

    return new Ticker({
      base,
      quote,
      quoteVolume: parseToFloat(ticker.to),
      baseVolume: parseToFloat(ticker.v),
      open: parseToFloat(ticker.o),
      high: parseToFloat(ticker.h),
      low: parseToFloat(ticker.l),
      close: parseToFloat(ticker.c),
    });
  });
};
