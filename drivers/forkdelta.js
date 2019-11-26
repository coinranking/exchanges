const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

module.exports = async () => {
  const tickers = await request('https://api.forkdelta.com/returnTicker');
  const markets = Object.keys(tickers);

  return markets.map((market) => {
    const [quote, base] = market.split('_');
    const ticker = tickers[market];

    // Warning: ForkDelta inverts base and quote
    return new Ticker({
      base,
      quote,
      quoteVolume: parseToFloat(ticker.baseVolume),
      baseVolume: parseToFloat(ticker.quoteVolume),
      close: parseToFloat(ticker.last),
    });
  });
};
