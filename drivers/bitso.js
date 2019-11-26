const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

module.exports = async () => {
  const { payload: tickers } = await request('https://api.bitso.com/v3/ticker/');

  return tickers.map((ticker) => {
    const [base, quote] = ticker.book.split('_');

    return new Ticker({
      base,
      quote,
      baseVolume: parseToFloat(ticker.volume),
      high: parseToFloat(ticker.high),
      low: parseToFloat(ticker.low),
      close: parseToFloat(ticker.last),
    });
  });
};
