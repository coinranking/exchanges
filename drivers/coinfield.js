const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { throttleMap, parseToFloat } = require('../lib/utils');

module.exports = async (isMocked) => {
  const { markets: pairs } = await request('https://api.coinfield.com/v1/markets');
  const symbols = pairs.map((item) => item.name);

  const tickers = throttleMap(symbols, async (symbol) => {
    const [base, quote] = symbol.split('/');
    const tickerName = `${base.toLowerCase()}${quote.toLowerCase()}`;
    const { markets } = await request(`https://api.coinfield.com/v1/tickers/${tickerName}`);
    const ticker = markets[0];

    return new Ticker({
      base,
      quote,
      high: parseToFloat(ticker.high),
      low: parseToFloat(ticker.low),
      close: parseToFloat(ticker.last),
      bid: parseToFloat(ticker.bid),
      ask: parseToFloat(ticker.ask),
      baseVolume: parseToFloat(ticker.vol),
    });
  }, isMocked ? 0 : 20); // 20 requests per second

  return Promise.all(tickers);
};
