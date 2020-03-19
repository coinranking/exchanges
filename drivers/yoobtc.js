const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

module.exports = async () => {
  const { data: markets } = await request('https://api.yoobtc.com/api/v1/tickers');

  return Object.keys(markets).map((market) => {
    const [base, quote] = market.split('/');
    const ticker = markets[market];

    return new Ticker({
      base,
      quote,
      high: parseToFloat(ticker.high),
      low: parseToFloat(ticker.low),
      close: parseToFloat(ticker.last),
      baseVolume: parseToFloat(ticker.vol),
    });
  });
};
