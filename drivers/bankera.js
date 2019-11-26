const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

module.exports = async () => {
  const tickers = await request('https://api-exchange.bankera.com/tickers');

  return tickers.map(({ market, ticker }) => {
    const [base, quote] = market.split('-');

    return new Ticker({
      base,
      quote,
      baseVolume: parseToFloat(ticker.volume),
      high: parseToFloat(ticker.high),
      low: parseToFloat(ticker.low),
      close: parseToFloat(ticker.last),
    });
  });
};
