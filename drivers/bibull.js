const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

module.exports = async () => {
  const { data: symbols } = await request('https://openapi.hiex.pro/open/api/common/symbols');
  const { data } = await request('https://openapi.hiex.pro/open/api/get_allticker');
  const tickers = data.ticker;
  const pairs = {};

  symbols.forEach((el) => {
    pairs[el.symbol] = {
      base: el.base_coin,
      quote: el.count_coin,
    };
  });

  return tickers.map((ticker) => {
    const { base, quote } = pairs[ticker.symbol];

    return new Ticker({
      base,
      quote,
      high: parseToFloat(ticker.high),
      low: parseToFloat(ticker.low),
      close: parseToFloat(ticker.last),
      bid: parseToFloat(ticker.sell),
      ask: parseToFloat(ticker.buy),
      baseVolume: parseToFloat(ticker.vol),
    });
  });
};
