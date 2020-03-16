const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

module.exports = async () => {
  const markets = await request('https://trade.bitvast.com/api/v2/tickers');
  const symbols = await request('https://trade.bitvast.com/api/v2/markets');

  const pairs = {};

  symbols.forEach((el) => {
    const [base, quote] = el.name.split('/');
    pairs[el.id] = {
      base,
      quote,
    };
  });

  return Object.keys(markets).map((market) => {
    const { base, quote } = pairs[market];
    const { ticker } = markets[market];

    return new Ticker({
      base,
      quote,
      high: parseToFloat(ticker.high),
      low: parseToFloat(ticker.low),
      close: parseToFloat(ticker.last),
      bid: parseToFloat(ticker.buy),
      ask: parseToFloat(ticker.sell),
      baseVolume: parseToFloat(ticker.base_volume),
      quoteVolume: parseToFloat(ticker.quote_volume),
    });
  });
};
