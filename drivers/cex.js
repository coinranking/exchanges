const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils');

module.exports = async () => {
  const quotes = ['USD', 'ETH', 'BTC'];
  const { data: tickers } = await request(`https://cex.io/api/tickers/${quotes.join('/')}`);

  return tickers.map((ticker) => {
    const [base, quote] = ticker.pair.split(':');

    return new Ticker({
      base,
      quote,
      baseVolume: parseToFloat(ticker.volume),
      high: parseToFloat(ticker.high),
      low: parseToFloat(ticker.low),
      close: parseToFloat(ticker.last),
    });
  });
};
