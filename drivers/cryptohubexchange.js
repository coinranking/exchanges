const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

module.exports = async () => {
  const markets = await request('https://cryptohubexchange.com/api/market/ticker/');

  return Object.keys(markets).map((market) => {
    const [base, quote] = market.split('_');
    const ticker = markets[market];

    return new Ticker({
      base,
      quote,
      high: parseToFloat(ticker.high24hr),
      low: parseToFloat(ticker.low24hr),
      close: parseToFloat(ticker.last),
      bid: parseToFloat(ticker.highestBid),
      ask: parseToFloat(ticker.lowestAsk),
      baseVolume: parseToFloat(ticker.baseVolume),
      quoteVolume: parseToFloat(ticker.quoteVolume),
    });
  });
};
