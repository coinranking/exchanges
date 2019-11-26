const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

module.exports = async () => {
  const tickers = await request('https://api.crex24.com/v2/public/tickers');

  return tickers.map((ticker) => {
    const [base, quote] = ticker.instrument.split('-');

    return new Ticker({
      base,
      quote,
      baseVolume: parseToFloat(ticker.baseVolume),
      quoteVolume: parseToFloat(ticker.quoteVolume),
      high: parseToFloat(ticker.high),
      low: parseToFloat(ticker.low),
      close: parseToFloat(ticker.last),
    });
  });
};
