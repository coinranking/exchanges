const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

module.exports = async () => {
  const data = await request('https://api.ethermium.com/v1/tokenTickers');

  return data.map(
    (ticker) => new Ticker({
      base: ticker.baseSymbol,
      baseReference: ticker.baseAddress,
      quote: ticker.quoteSymbol,
      quoteReference: ticker.quoteAddress,
      high: parseToFloat(ticker.highestBid),
      ask: parseToFloat(ticker.lowestAsk),
      close: parseToFloat(ticker.last),
      baseVolume: parseToFloat(ticker.baseVolume),
      quoteVolume: parseToFloat(ticker.quoteVolume),
    }),
  );
};
