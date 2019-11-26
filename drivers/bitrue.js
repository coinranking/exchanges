const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

module.exports = async () => {
  const response = await request('https://www.bitrue.com/kline-api/public.json?command=returnTicker');
  const tickers = response.data;
  const markets = Object.keys(tickers);

  return markets.map((market) => {
    const [base, quote] = market.split('_');

    const ticker = tickers[market];

    return new Ticker({
      base,
      quote,
      high: parseToFloat(ticker.high24hr),
      low: parseToFloat(ticker.low24hr),
      close: parseToFloat(ticker.last),
      baseVolume: parseToFloat(ticker.baseVolume),
      quoteVolume: parseToFloat(ticker.quoteVolume),
    });
  });
};
