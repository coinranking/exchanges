const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

module.exports = async () => {
  const { data: tickers } = await request('https://www.mxc.com/open/api/v1/data/ticker');
  const markets = Object.keys(tickers);

  return markets.map((market) => {
    const [base, quote] = market.split('_');
    const ticker = tickers[market];

    return new Ticker({
      base,
      quote,
      baseVolume: parseToFloat(ticker.volume),
      open: parseToFloat(ticker.open),
      high: parseToFloat(ticker.high),
      low: parseToFloat(ticker.low),
      close: parseToFloat(ticker.last),
    });
  });
};
