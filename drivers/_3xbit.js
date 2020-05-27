const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

module.exports = async () => {
  const tickers = await request('https://api.exchange.3xbit.com.br/ticker/');
  const markets = Object.keys(tickers);

  return markets.map((market) => {
    // Warning: 3xbit inverts base and quote only in the pair
    const [quote, base] = market.split('_');
    const ticker = tickers[market];

    return new Ticker({
      base,
      quote,
      quoteVolume: parseToFloat(ticker.volume_market),
      baseVolume: parseToFloat(ticker.volume),
      close: parseToFloat(ticker.last),
      open: parseToFloat(ticker.open),
      high: parseToFloat(ticker.max),
      low: parseToFloat(ticker.min),
    });
  });
};
