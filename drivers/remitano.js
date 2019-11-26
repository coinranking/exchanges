const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

module.exports = async () => {
  const tickers = await request('https://remitano.com/api/v1/volumes/market_summaries');
  const markets = Object.keys(tickers);

  return markets.map((market) => {
    const ticker = tickers[market];
    const base = ticker.currency1;
    const quote = ticker.currency2;

    return new Ticker({
      base,
      quote,
      baseVolume: parseToFloat(ticker.volume24h),
      close: parseToFloat(ticker.last),
      high: parseToFloat(ticker.high_price),
      low: parseToFloat(ticker.low_price),
    });
  });
};
