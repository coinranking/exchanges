const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

module.exports = async () => {
  const result = await request('https://api.kucoin.com/api/v1/market/allTickers');
  const tickers = result.data.ticker;

  return tickers.map((ticker) => {
    const [base, quote] = ticker.symbol.split('-');

    return new Ticker({
      base,
      quote,
      baseVolume: parseToFloat(ticker.vol),
      close: parseToFloat(ticker.last),
      high: parseToFloat(ticker.high),
      low: parseToFloat(ticker.low),
    });
  });
};
