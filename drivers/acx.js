const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

module.exports = async () => {
  const tickers = await request('https://acx.io/api/v2/tickers.json');
  const markets = Object.keys(tickers);

  return markets.map((market) => {
    const item = tickers[market];
    const { ticker } = item;
    const base = item.base_unit;
    const quote = item.quote_unit;

    return new Ticker({
      base,
      quote,
      baseVolume: parseToFloat(ticker.vol),
      open: parseToFloat(ticker.open),
      high: parseToFloat(ticker.high),
      low: parseToFloat(ticker.low),
      close: parseToFloat(ticker.last),
    });
  });
};
