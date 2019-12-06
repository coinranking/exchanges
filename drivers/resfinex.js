const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

module.exports = async () => {
  const tickers = await request('https://api.resfinex.com/engine/ticker');

  return tickers.data.map((ticker) => {
    const [base, quote] = ticker.pair.split('_');

    return new Ticker({
      base,
      quote,
      high: parseToFloat(ticker.high),
      low: parseToFloat(ticker.low),
      close: parseToFloat(ticker.last),
      baseVolume: parseToFloat(ticker.volumeBase),
      quoteVolume: parseToFloat(ticker.volume),
    });
  });
};
