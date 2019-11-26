const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

module.exports = async () => {
  const tickers = await request('https://btc-trade.com.ua/api/ticker');
  const markets = Object.keys(tickers);

  return markets.map((market) => {
    const [base, quote] = market.split('_');

    const ticker = tickers[market];

    return new Ticker({
      base,
      quote,
      high: parseToFloat(ticker.high),
      low: parseToFloat(ticker.low),
      close: parseToFloat(ticker.last),
      vwap: parseToFloat(ticker.avg),
      baseVolume: parseToFloat(ticker.vol),
      quoteVolume: parseToFloat(ticker.vol_cur),
    });
  });
};
