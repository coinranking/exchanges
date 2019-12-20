const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

module.exports = async () => {
  const symbols = await request('https://max-api.maicoin.com/api/v2/markets');
  const tickers = await request('https://max-api.maicoin.com/api/v2/tickers');
  const pairs = {};

  symbols.forEach((el) => {
    pairs[el.id] = {
      base: el.base_unit,
      quote: el.quote_unit,
    };
  });

  return Object.keys(tickers).map((tickerName) => {
    const { base, quote } = pairs[tickerName];
    const ticker = tickers[tickerName];

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
