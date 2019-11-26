const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

module.exports = async () => {
  const markets = await request('https://api.bequant.io/api/2/public/symbol');
  const tickers = await request('https://api.bequant.io/api/2/public/ticker');

  return markets.map((market) => {
    const base = market.baseCurrency;
    const quote = market.quoteCurrency;

    const ticker = tickers.find((item) => item.symbol === market.id);
    if (!ticker) return undefined;

    return new Ticker({
      base,
      quote,
      quoteVolume: parseToFloat(ticker.volumeQuote),
      baseVolume: parseToFloat(ticker.volume),
      open: parseToFloat(ticker.open),
      high: parseToFloat(ticker.high),
      low: parseToFloat(ticker.low),
      close: parseToFloat(ticker.last),
    });
  });
};
