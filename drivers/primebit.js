const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils');

module.exports = async () => {
  const markets = await request('https://app.primebit.com:443/api/v1/trading/market_data/summary/live');

  return Object.keys(markets).map((market) => {
    const ticker = markets[market];
    const base = market.substring(0, 3);
    const quote = market.replace(base, '');

    return new Ticker({
      base,
      quote,
      high: parseToFloat(ticker.max_price),
      low: parseToFloat(ticker.min_price),
      close: parseToFloat(ticker.last_price),
      bid: parseToFloat(ticker.highest_bid),
      ask: parseToFloat(ticker.lowest_ask),
      baseVolume: parseToFloat(ticker.base_volume),
      quoteVolume: parseToFloat(ticker.quote_volume),

    });
  });
};
