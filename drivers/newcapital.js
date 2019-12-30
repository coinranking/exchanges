const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

module.exports = async () => {
  const tickers = await request('https://api.new.capital/v1/ticker');

  return tickers.map((ticker) => {
    const [base, quote] = ticker.symbol.split('_');

    return new Ticker({
      base,
      quote,
      high: parseToFloat(ticker.highPrice),
      low: parseToFloat(ticker.lowPrice),
      close: parseToFloat(ticker.lastPrice),
      bid: parseToFloat(ticker.bidPrice),
      ask: parseToFloat(ticker.askPrice),
      baseVolume: parseToFloat(ticker.volume),
      quoteVolume: parseToFloat(ticker.quoteVolume),
    });
  });
};
