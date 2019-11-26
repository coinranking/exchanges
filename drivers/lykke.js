const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

module.exports = async () => {
  const tickers = await request('https://public-api.lykke.com/api/Market');

  return tickers.map((ticker) => {
    const pair = /^([A-Z0-9a-z]*)(ETH|GBP|BTC|CHF|USD|DKK|EUR|HKD|CZK|JPY|SEK|CAD|SGD)$/.exec(ticker.assetPair);
    if (!pair) return undefined;
    const [, base, quote] = pair;

    return new Ticker({
      base,
      quote,
      quoteVolume: parseToFloat(ticker.volume24H),
      close: parseToFloat(ticker.lastPrice),
    });
  });
};
