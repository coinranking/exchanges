const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

module.exports = async () => {
  // get base and quote data for tickers
  const symbols = await request('https://excoincial.com/api/v2/markets');
  const pairs = {};

  symbols.forEach((el) => {
    const [base, quote] = el.name.split('/');
    pairs[el.id] = {
      base,
      quote,
    };
  });

  const markets = await request('https://excoincial.com/api/v2/tickers');

  return Object.keys(markets).map((market) => {
    const { base, quote } = pairs[market];
    const { ticker } = markets[market];

    return new Ticker({
      base,
      quote,
      high: parseToFloat(ticker.high),
      low: parseToFloat(ticker.low),
      close: parseToFloat(ticker.last),
      baseVolume: parseToFloat(ticker.vol),
      quoteVolume: parseToFloat(ticker.quotevol),
    });
  });
};
