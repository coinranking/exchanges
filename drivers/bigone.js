const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

module.exports = async () => {
  const result = await request('https://big.one/api/v2/tickers');
  const tickers = result.data;

  return tickers.map((ticker) => {
    const [base, quote] = ticker.market_id.split('-');

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
