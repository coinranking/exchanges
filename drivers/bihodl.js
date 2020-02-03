const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

module.exports = async () => {
  const tickers = await request('https://service.bihodl.com/market/symbol-thumb');

  return tickers.map((ticker) => {
    const [base, quote] = ticker.symbol.split('/');

    return new Ticker({
      base,
      quote,
      close: parseToFloat(ticker.close),
      high: parseToFloat(ticker.high),
      ask: parseToFloat(ticker.low),
      baseVolume: parseToFloat(ticker.volume),
    });
  });
};
