const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

module.exports = async () => {
  const { data: tickers } = await request('https://api.hoo.com/open/v1/tickers/market');

  return tickers.map((ticker) => {
    const [base, quote] = ticker.symbol.split('-');

    return new Ticker({
      base,
      quote,
      high: parseToFloat(ticker.high),
      low: parseToFloat(ticker.low),
      close: parseToFloat(ticker.price),
      baseVolume: parseToFloat(ticker.volume),
    });
  });
};
