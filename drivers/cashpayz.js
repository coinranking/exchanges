const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

module.exports = async () => {
  const { Data: tickers } = await request('https://cashpayz.exchange/public/ticker');
  const markets = Object.keys(tickers);

  return markets.map((market) => {
    // Warning: Cashpayz inverts base and quote
    const [quote, base] = market.split('_');
    const ticker = tickers[market];

    return new Ticker({
      base,
      quote,
      baseVolume: parseToFloat(ticker.quoteVolume),
      quoteVolume: parseToFloat(ticker.baseVolume),
      high: parseToFloat(ticker.high24hr),
      low: parseToFloat(ticker.low24hr),
      close: parseToFloat(ticker.last),
    });
  });
};
