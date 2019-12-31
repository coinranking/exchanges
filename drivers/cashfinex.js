const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

module.exports = async () => {
  const { tradeStats: tickers } = await request('https://api.cashfinex.com/api/trades/tradeStats');

  return tickers.map((ticker) => {
    const [base, quote] = ticker.pair.split('/');

    return new Ticker({
      base,
      quote,
      high: parseToFloat(ticker.High),
      low: parseToFloat(ticker.Low),
      close: parseToFloat(ticker.Last),
      bid: parseToFloat(ticker.lastBid),
      ask: parseToFloat(ticker.lastAsk),
      baseVolume: parseToFloat(ticker.Volume),
    });
  });
};
