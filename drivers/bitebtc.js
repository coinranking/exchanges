const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

module.exports = async () => {
  const data = await request('https://bitebtc.com/api/v1/market');
  const tickers = data.result;

  return tickers.map((ticker) => {
    const [base, quote] = ticker.market.split('_');

    return new Ticker({
      base,
      quote,
      quoteVolume: parseToFloat(ticker.base_volume),
      baseVolume: parseToFloat(ticker.volume),
      close: parseToFloat(ticker.close),
      open: parseToFloat(ticker.open),
      high: parseToFloat(ticker.high),
      low: parseToFloat(ticker.low),
      vwap: parseToFloat(ticker.average),
    });
  });
};
