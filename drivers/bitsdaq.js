const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

module.exports = async () => {
  const tickers = await request('https://v2.bitsdaq.io/api/tickers');

  return tickers.map((ticker) => {
    const [base, quote] = ticker.instrumentId.split('-');

    return new Ticker({
      base,
      quote,
      high: parseToFloat(ticker['24hHigh']),
      low: parseToFloat(ticker['24hLow']),
      close: parseToFloat(ticker.lastPrice),
      bid: parseToFloat(tickers.bestBid),
      aks: parseToFloat(ticker.bestAsk),
      baseVolume: parseToFloat(ticker['24hVolume']),
    });
  });
};
