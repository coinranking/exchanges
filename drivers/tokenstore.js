const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

module.exports = async () => {
  const data = await request('https://v1-1.api.token.store/ticker');
  const markets = Object.keys(data);

  return markets.map((market) => {
    // Warning: TokenStore inverts base and quote
    const [quote, base] = market.split('_');
    const ticker = data[market];
    if (!ticker) return undefined;

    return new Ticker({
      base,
      quote,
      baseVolume: parseToFloat(ticker.quoteVolume),
      quoteVolume: parseToFloat(ticker.baseVolume),
      close: parseToFloat(ticker.last),
    });
  });
};
