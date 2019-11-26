const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

module.exports = async () => {
  const { pairs } = await request('https://api.tidex.com/api/3/info');
  const markets = Object.keys(pairs);
  const tickers = await request(`https://api.tidex.com/api/3/ticker/${markets.join('-')}`);

  return markets.map((market) => {
    const [base, quote] = market.split('_');
    const ticker = tickers[market];

    return new Ticker({
      base,
      quote,
      quoteVolume: parseToFloat(ticker.vol),
      baseVolume: parseToFloat(ticker.vol_cur),
      close: parseToFloat(ticker.last),
      high: parseToFloat(ticker.high),
      low: parseToFloat(ticker.low),
      vwap: parseToFloat(ticker.avg),
    });
  });
};
