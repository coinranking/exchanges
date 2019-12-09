const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

module.exports = async () => {
  // get base and quote data for tickers
  const { data: symbols } = await request('https://openapi.biki.com/open/api/common/symbols');
  const pairs = {};

  symbols.forEach((el) => {
    pairs[el.symbol] = {
      base: el.base_coin,
      quote: el.count_coin,
    };
  });

  const { data } = await request('https://openapi.biki.com/open/api/get_allticker');
  const { ticker: tickers } = data;

  return tickers.map((ticker) => {
    const { base, quote } = pairs[ticker.symbol];

    return new Ticker({
      base,
      quote,
      high: parseToFloat(ticker.high),
      low: parseToFloat(ticker.low),
      close: parseToFloat(ticker.last),
      baseVolume: parseToFloat(ticker.vol),
    });
  });
};