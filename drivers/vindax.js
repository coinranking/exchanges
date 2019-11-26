const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

module.exports = async () => {
  const tickers = await request('https://api.vindax.com/api/v1/returnTicker');
  const markets = Object.keys(tickers);

  return markets.map((market) => {
    const [base, quote] = market.split('_');
    const ticker = tickers[market];
    if (!ticker) return undefined;

    return new Ticker({
      base,
      quote,
      baseVolume: parseToFloat(ticker.baseVolume),
      quoteVolume: parseToFloat(ticker.quoteVolume),
      high: parseToFloat(ticker.high24hr),
      low: parseToFloat(ticker.low24hr),
      close: parseToFloat(ticker.last),
    });
  });
};
