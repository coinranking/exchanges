const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

module.exports = async () => {
  const { data: tickers } = await request('https://api2.tokenize.exchange/public/v1/market/get-summaries');

  return tickers.map((ticker) => {
    const [base, quote] = ticker.market.split('-');

    return new Ticker({
      base,
      quote,
      high: parseToFloat(ticker.high),
      low: parseToFloat(ticker.low),
      close: parseToFloat(ticker.lastPrice),
      bid: parseToFloat(ticker.bidPrice),
      ask: parseToFloat(ticker.askPrice),
      baseVolume: parseToFloat(ticker.volume),
    });
  });
};
