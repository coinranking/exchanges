const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

module.exports = async () => {
  const { symbol: markets } = await request('http://api.coinbene.com/v1/market/symbol');
  const { ticker: tickers } = await request('http://api.coinbene.com/v1/market/ticker?symbol=all');

  return tickers.map((ticker) => {
    const market = markets.find((item) => `${item.baseAsset}${item.quoteAsset}` === ticker.symbol.toUpperCase());
    if (!market) return undefined;

    const base = market.baseAsset;
    const quote = market.quoteAsset;

    return new Ticker({
      base,
      quote,
      close: parseToFloat(ticker.last),
      baseVolume: parseToFloat(ticker['24hrVol']),
      high: parseToFloat(ticker['24hrHigh']),
      low: parseToFloat(ticker['24hrLow']),
    });
  });
};
