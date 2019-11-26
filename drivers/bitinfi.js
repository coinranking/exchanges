const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

module.exports = async () => {
  const result = await request('https://hq.bitinfi.com/v1/product.ashx');
  const tickers = result.data;

  return tickers
    .filter((ticker) => ticker.status === true)
    .map((ticker) => {
      const [base, quote] = ticker.symbol.split('_');

      return new Ticker({
        base,
        quote,
        baseVolume: parseToFloat(ticker.volume),
        close: parseToFloat(ticker.close),
        open: parseToFloat(ticker.open),
        high: parseToFloat(ticker.high),
        low: parseToFloat(ticker.low),
      });
    });
};
