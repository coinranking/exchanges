const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

module.exports = async () => {
  const { data: tickers } = await request('https://datacenter.iqfinex.com/v1/tickers');
  const markets = Object.keys(tickers);

  return markets.map((market) => {
    const pair = /^([A-Z]*)(BTC|ETH|USDT)$/.exec(market);
    if (!pair) return undefined;
    const [, base, quote] = pair;
    const ticker = tickers[market];

    return new Ticker({
      base,
      quote,
      baseVolume: parseToFloat(ticker.volume24),
      close: parseToFloat(ticker.last),
      open: parseToFloat(ticker.open),
      high: parseToFloat(ticker.high),
      low: parseToFloat(ticker.low),
    });
  });
};
