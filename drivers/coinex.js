const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

module.exports = async () => {
  const { data } = await request('https://api.coinex.com/v1/market/ticker/all');
  const tickers = data.ticker;
  const markets = Object.keys(tickers);

  return markets.map((market) => {
    const pair = /^([A-Z]*)(ETH|BCH|BTC|USDC|USDT|PAX)$/.exec(market);
    if (!pair) return undefined;
    const [, base, quote] = pair;
    const ticker = tickers[market];

    return new Ticker({
      base,
      quote,
      baseVolume: parseToFloat(ticker.vol),
      close: parseToFloat(ticker.last),
      open: parseToFloat(ticker.open),
      high: parseToFloat(ticker.high),
      low: parseToFloat(ticker.low),
    });
  });
};
