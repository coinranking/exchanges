const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

module.exports = async () => {
  const tickers = await request('https://api.livecoin.net/exchange/ticker');

  return tickers.map((ticker) => {
    const [base, quote] = ticker.symbol.split('/');

    return new Ticker({
      base,
      quote,
      baseVolume: parseToFloat(ticker.volume),
      close: parseToFloat(ticker.last),
      high: parseToFloat(ticker.high),
      low: parseToFloat(ticker.low),
      vwap: parseToFloat(ticker.vwap),
    });
  });
};
