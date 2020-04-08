const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

module.exports = async () => {
  const markets = await request('https://fivestarexchange.in/public/ticker');

  return Object.keys(markets).map((market) => {
    const [base, quote] = market.split('_');
    const ticker = markets[market];

    return new Ticker({
      base,
      quote,
      quoteName: ticker.CurrencyFName,
      high: parseToFloat(ticker.high24hr),
      low: parseToFloat(ticker.low24hr),
      close: parseToFloat(ticker.last),
      bid: parseToFloat(ticker.highestBid),
      ask: parseToFloat(ticker.lowestAskBid),
      baseVolume: parseToFloat(ticker.quoteVolume), // reversed with quote
      quoteVolume: parseToFloat(ticker.baseVolume),
    });
  });
};
