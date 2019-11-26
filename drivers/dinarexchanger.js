const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { flatMap, parseToFloat } = require('../lib/utils');

module.exports = async () => {
  const quotes = ['USDT', 'DNC'];

  return flatMap(quotes, async (quote) => {
    const tickers = await request(`https://dapi.dinarexchanger.com/exchange/api/v1/GetMarketStatus/${quote}`);

    return tickers.map((ticker) => {
      const base = ticker.market.replace(quote, '');

      return new Ticker({
        base,
        quote,
        baseVolume: parseToFloat(ticker.volume),
        open: parseToFloat(ticker.open),
        high: parseToFloat(ticker.high),
        low: parseToFloat(ticker.low),
        close: parseToFloat(ticker.close),
      });
    });
  });
};
