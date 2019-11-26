const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat, throttleMap } = require('../lib/utils.js');

module.exports = async (isMocked) => {
  const { data: markets } = await request('https://api.dobiexchange.com/trade/markets');

  const tickers = throttleMap(markets, async (market) => {
    const [base, quote] = market.split('_');
    const { data: ticker } = await request(`https://api.dobiexchange.com/market/quote?market=${market}`);

    if (!ticker) return undefined;

    return new Ticker({
      base,
      quote,
      baseVolume: parseToFloat(ticker.volume),
      quoteVolume: parseToFloat(ticker.amount),
      high: parseToFloat(ticker.high),
      low: parseToFloat(ticker.low),
      close: parseToFloat(ticker.last),
      bid: parseToFloat(ticker.buy),
      ask: parseToFloat(ticker.sell),
    });
  }, isMocked ? 0 : 50); // 20 request per second

  return Promise.all(tickers);
};
