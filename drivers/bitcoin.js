const request = require('../lib/request');
const Ticker = require('../models/ticker');
const { parseToFloat } = require('../lib/utils.js');

module.exports = async () => {
  const symbols = await request('https://api.exchange.bitcoin.com/api/2/public/symbol');
  const tickers = await request('https://api.exchange.bitcoin.com/api/2/public/ticker');
  const pairs = {};

  // set symbol as key
  symbols.forEach((el) => {
    pairs[el.id] = el;
  });

  return tickers.map((ticker) => {
    const { baseCurrency: base, quoteCurrency: quote } = pairs[ticker.symbol];

    return new Ticker({
      base,
      quote,
      high: parseToFloat(ticker.high),
      low: parseToFloat(ticker.low),
      close: parseToFloat(ticker.last),
      bid: parseToFloat(ticker.bid),
      ask: parseToFloat(ticker.ask),
      baseVolume: parseToFloat(ticker.volume),
      quoteVolume: parseToFloat(ticker.volumeQuote),
    });
  });
};
