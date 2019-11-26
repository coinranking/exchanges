const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

module.exports = async () => {
  const tickers = await request('https://api.abcc.com/api/v2/tickers.json');
  const pairs = Object.keys(tickers);

  return pairs.map((pair) => {
    const symbols = /^([a-z]*)(btc|usdt|eth)$/.exec(pair);
    if (!symbols) return undefined;

    const [, base, quote] = symbols;
    const { ticker } = tickers[pair];

    return new Ticker({
      base,
      quote,
      baseVolume: parseToFloat(ticker.vol),
      close: parseToFloat(ticker.last),
      open: parseToFloat(ticker.open),
      high: parseToFloat(ticker.high),
      low: parseToFloat(ticker.low),
    });
  });
};
