const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

module.exports = async () => {
  const tickers = await request('https://btcturk.com/api/ticker');

  return tickers.map((ticker) => {
    const base = ticker.numeratorsymbol;
    const quote = ticker.denominatorsymbol;

    return new Ticker({
      base,
      quote,
      baseVolume: parseToFloat(ticker.volume),
      open: parseToFloat(ticker.open),
      high: parseToFloat(ticker.high),
      low: parseToFloat(ticker.low),
      close: parseToFloat(ticker.last),
    });
  });
};
