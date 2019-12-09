const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

module.exports = async () => {
  const { ticker: tickers } = await request('https://www.tokok.com/api/v1/tickers');

  return tickers.map((ticker) => {
    const [quote, base] = ticker.symbol.split('_');

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
