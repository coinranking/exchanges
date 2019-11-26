const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

module.exports = async () => {
  const tickers = await request('https://exmarkets.com/api/trade/v1/market/ticker');
  const markets = Object.keys(tickers);

  return markets.map((market) => {
    const [base, quote] = market.split('-');
    const ticker = tickers[market];

    return new Ticker({
      base,
      quote,
      baseVolume: parseToFloat(ticker.volume),
      high: parseToFloat(ticker.high),
      low: parseToFloat(ticker.low),
      close: parseToFloat(ticker.last),
      bid: parseToFloat(ticker.bid),
      ask: parseToFloat(ticker.ask),
    });
  });
};
