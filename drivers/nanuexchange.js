const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

module.exports = async () => {
  const tickers = await request('https://nanu.exchange/public?command=returnTicker');
  const markets = Object.keys(tickers);

  return markets.map((market) => {
    // Warning: Nanu exchange confuses base and quote
    const [quote, base] = market.split('_');
    const ticker = tickers[market];

    return new Ticker({
      base,
      quote,
      quoteVolume: parseToFloat(ticker.baseVolume),
      baseVolume: parseToFloat(ticker.quoteVolume),
      high: parseToFloat(ticker.high24hr),
      low: parseToFloat(ticker.low24hr),
      close: parseToFloat(ticker.last),
    });
  });
};
