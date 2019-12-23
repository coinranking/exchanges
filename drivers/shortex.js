const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

module.exports = async () => {
  // get base and quote data for tickers
  const symbols = await request('https://exchange.shortex.net/api/v2/backend/public/markets');
  const pairs = {};

  symbols.forEach((el) => {
    pairs[el.id] = {
      base: el.base_unit,
      quote: el.quote_unit,
    };
  });

  const tickers = await request('https://exchange.shortex.net/api/v2/backend/public/markets/tickers');

  return Object.keys(tickers).map((tickerName) => {
    const { ticker } = tickers[tickerName];
    const { base, quote } = pairs[tickerName];

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
