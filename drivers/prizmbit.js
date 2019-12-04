const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

module.exports = async () => {
  const tickers = await request('https://api.prizmbit.com/api/po/MarketData/GetMarketPrices');

  return tickers.map((ticker) => {
    const [base, quote] = ticker.marketName.split('/');

    return new Ticker({
      base,
      quote,
      high: parseToFloat(ticker.highPrice),
      low: parseToFloat(ticker.lowPrice),
      close: parseToFloat(ticker.price),
      bid: parseToFloat(ticker.bid),
      ask: parseToFloat(ticker.ask),
      baseVolume: parseToFloat(ticker.volume),
    });
  });
};
