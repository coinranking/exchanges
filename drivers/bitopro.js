const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

module.exports = async () => {
  const { data: tickers } = await request('https://api.bitopro.com/v2/tickers');

  return tickers.map((ticker) => {
    const [base, quote] = ticker.pair.split('_');

    return new Ticker({
      base,
      quote,
      baseVolume: parseToFloat(ticker.volume24hr),
      high: parseToFloat(ticker.high24hr),
      low: parseToFloat(ticker.low24hr),
      close: parseToFloat(ticker.lastPrice),
    });
  });
};
