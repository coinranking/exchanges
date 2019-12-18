const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

module.exports = async () => {
  const { result } = await request('https://ftx.com/api/markets');
  const tickers = result.filter((item) => item.type === 'spot');

  return tickers.map((ticker) => {
    const [base, quote] = ticker.name.split('/');

    return new Ticker({
      base,
      quote,
      close: parseToFloat(ticker.last),
      bid: parseToFloat(ticker.bid),
      ask: parseToFloat(ticker.ask),
      quoteVolume: parseToFloat(ticker.quoteVolume24h),
    });
  });
};
