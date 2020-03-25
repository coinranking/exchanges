const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

module.exports = async () => {
  const tickers = await request('https://exchange.drgx.io/cmc/public/returnTicker');
  const pairs = Object.keys(tickers);

  return pairs.map((pair) => {
    const [base, quote] = pair.split('-');
    const ticker = tickers[pair];

    return new Ticker({
      base,
      quote,
      quoteVolume: parseToFloat(ticker.quoteVolume24hr),
      baseVolume: parseToFloat(ticker.volume24hr),
      bid: parseToFloat(ticker.highestBid),
      ask: parseToFloat(ticker.lowestAsk),
      close: parseToFloat(ticker.last),
      high: parseToFloat(ticker.high24hr),
      low: parseToFloat(ticker.low24hr),
    });
  });
};
