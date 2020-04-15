const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

module.exports = async () => {
  const markets = await request('https://ticker.saturn.network/returnTicker.json');

  return Object.keys(markets).map((market) => {
    const [quote, baseReference] = market.split('_');
    const ticker = markets[market];

    return new Ticker({
      base: ticker.symbol,
      baseReference,
      baseName: ticker.name,
      quote,
      close: parseToFloat(ticker.last),
      baseVolume: parseToFloat(ticker.quoteVolume), // reversed with quote
      quoteVolume: parseToFloat(ticker.baseVolume),
    });
  });
};
