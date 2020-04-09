const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

module.exports = async () => {
  const markets = await request('https://ticker.saturn.network/returnTicker.json');

  return Object.keys(markets).map((market) => {
    const [base] = market.split('_');
    const ticker = markets[market];

    return new Ticker({
      base,
      quote: ticker.symbol,
      quoteName: ticker.name,
      close: parseToFloat(ticker.last),
      baseVolume: parseToFloat(ticker.quoteVolume), // reversed with quote
      quoteVolume: parseToFloat(ticker.baseVolume),
    });
  });
};
