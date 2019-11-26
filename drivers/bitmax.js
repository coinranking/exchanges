const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

module.exports = async () => {
  const tickers = await request('https://bitmax.io/api/v1/ticker/24hr');

  return tickers.map((ticker) => {
    const [base, quote] = ticker.symbol.split('/');

    return new Ticker({
      base,
      quote,
      baseVolume: parseToFloat(ticker.volume),
      close: parseToFloat(ticker.closePrice),
      open: parseToFloat(ticker.openPrice),
      high: parseToFloat(ticker.highPrice),
      low: parseToFloat(ticker.lowPrice),
    });
  });
};
