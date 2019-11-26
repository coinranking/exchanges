const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

module.exports = async () => {
  const markets = await request('https://bitubu.com/api/v2/markets');
  const tickers = await request('https://bitubu.com/api/v2/tickers');

  return markets.map((market) => {
    const base = market.ask_unit;
    const quote = market.bid_unit;

    if (!tickers[market.id]) return undefined;
    const { ticker } = tickers[market.id];

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
