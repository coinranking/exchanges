const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

module.exports = async () => {
  const { data: { pairs: markets } } = await request('https://sigen.pro/v1/web-public/exchange/summary');

  return Object.keys(markets).map((market) => {
    const [base, quote] = market.split('_');
    const ticker = markets[market];

    return new Ticker({
      base,
      quote,
      high: parseToFloat(ticker.high24hr),
      low: parseToFloat(ticker.low24hr),
      close: parseToFloat(ticker.last),
      bid: parseToFloat(ticker.lowestAsk),
      ask: parseToFloat(ticker.highestBid),
      baseVolume: parseToFloat(ticker.baseVolume),
      quoteVolume: parseToFloat(ticker.quoteVolume),
    });
  });
};
