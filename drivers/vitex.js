const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

module.exports = async () => {
  const { data: tickers } = await request('https://vitex.vite.net/api/v1/ticker/24hr');

  return tickers.map((ticker) => {
    const base = ticker.tradeTokenSymbol;
    const quote = ticker.quoteTokenSymbol;

    const baseReference = ticker.tradeToken;
    const quoteReference = ticker.quoteToken;

    return new Ticker({
      base,
      quote,
      baseReference,
      quoteReference,
      quoteVolume: parseToFloat(ticker.amount),
      baseVolume: parseToFloat(ticker.quantity),
      open: parseToFloat(ticker.openPrice),
      high: parseToFloat(ticker.highPrice),
      low: parseToFloat(ticker.lowPrice),
      close: parseToFloat(ticker.closePrice),
    });
  });
};
