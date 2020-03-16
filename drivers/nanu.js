const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

module.exports = async () => {
  const markets = await request('https://nanu.exchange/public?command=returnTicker');

  return Object.keys(markets).map((market) => {
    const [quote, base] = market.split('_'); // reversed
    const ticker = markets[market];

    return new Ticker({
      base,
      quote,
      high: parseToFloat(ticker.high24hr),
      low: parseToFloat(ticker.min24hr),
      close: parseToFloat(ticker.last),
      bid: parseToFloat(ticker.highestBid),
      ask: parseToFloat(ticker.lowestAsk),
      baseVolume: parseToFloat(ticker.baseVolume), // reversed
      quoteVolume: parseToFloat(ticker.quoteVolume),
    });
  });
};
