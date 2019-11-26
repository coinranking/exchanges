const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

module.exports = async () => {
  const data = await request('http://api.zb.cn/data/v1/markets');
  const markets = Object.keys(data);
  const tickers = await request('http://api.zb.cn/data/v1/allTicker');

  return markets.map((market) => {
    const [base, quote] = market.split('_');

    const ticker = tickers[`${base}${quote}`];
    if (!ticker) return undefined;

    return new Ticker({
      base,
      quote,
      close: parseToFloat(ticker.last),
      baseVolume: parseToFloat(ticker.vol),
      high: parseToFloat(ticker.high),
      low: parseToFloat(ticker.low),
    });
  });
};
