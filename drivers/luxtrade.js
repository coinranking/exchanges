const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

module.exports = async () => {
  const { data: { market } } = await request('https://luxtrade.online/Mapi/Index/marketInfo');

  return market.map((pair) => {
    const [quote, base] = pair.ticker.split('_'); // reversed
    const ticker = pair;

    return new Ticker({
      base,
      quote,
      high: parseToFloat(ticker.max_price),
      low: parseToFloat(ticker.min_price),
      close: parseToFloat(ticker.last_price),
      ask: parseToFloat(ticker.sell_price),
      bid: parseToFloat(ticker.buy_price),
      baseVolume: parseToFloat(ticker.volume),
    });
  });
};
