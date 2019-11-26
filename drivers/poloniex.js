const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

module.exports = async () => {
  const tickers = await request('https://poloniex.com/public?command=returnTicker');
  const pairs = Object.keys(tickers);

  return pairs.map((pair) => {
    const [quote, base] = pair.split('_');
    const ticker = tickers[pair];

    return new Ticker({
      base,
      quote,
      quoteVolume: parseToFloat(ticker.baseVolume),
      baseVolume: parseToFloat(ticker.quoteVolume),
      close: parseToFloat(ticker.last),
      high: parseToFloat(ticker.high24hr),
      low: parseToFloat(ticker.low24hr),
    });
  });
};
