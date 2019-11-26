const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

module.exports = async () => {
  const tickers = await request('https://api.lbkex.com/v1/ticker.do?symbol=all');

  return tickers.map(({ symbol, ticker }) => {
    const [base, quote] = symbol.split('_');

    return new Ticker({
      base,
      quote,
      baseVolume: parseToFloat(ticker.vol),
      close: parseToFloat(ticker.latest),
      high: parseToFloat(ticker.high),
      low: parseToFloat(ticker.low),
    });
  });
};
